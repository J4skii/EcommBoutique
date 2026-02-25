import crypto from "crypto"

export interface PayFastData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  cell_number?: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
}

export class PayFastService {
  private merchantId: string
  private merchantKey: string
  private passphrase: string
  private sandbox: boolean

  constructor() {
    this.merchantId = process.env.PAYFAST_MERCHANT_ID!
    this.merchantKey = process.env.PAYFAST_MERCHANT_KEY!
    this.passphrase = process.env.PAYFAST_PASSPHRASE!
    this.sandbox = process.env.NODE_ENV !== "production"

    if (!this.merchantId || !this.merchantKey) {
      throw new Error("PayFast credentials not configured")
    }
  }

  generateSignature(data: Record<string, string>): string {
    // Create parameter string
    const paramString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join("&")

    // Add passphrase if set
    const stringToHash = this.passphrase ? `${paramString}&passphrase=${this.passphrase}` : paramString

    // Generate signature using SHA-256 (PayFast requirement)
    return crypto.createHash("sha256").update(stringToHash).digest("hex")
  }

  createPaymentData(orderData: {
    orderId: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    amount: number
    description: string
  }): PayFastData & { signature: string } {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const paymentData: PayFastData = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      notify_url: `${baseUrl}/api/payment/notify`,
      name_first: orderData.customerName.split(" ")[0] || "Customer",
      name_last: orderData.customerName.split(" ").slice(1).join(" ") || "",
      email_address: orderData.customerEmail,
      cell_number: orderData.customerPhone,
      m_payment_id: orderData.orderId,
      amount: orderData.amount.toFixed(2),
      item_name: "Paitons Boutique Order",
      item_description: orderData.description,
      custom_str1: orderData.orderId,
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(Object.entries(paymentData).filter(([_, v]) => v !== undefined)) as Record<string, string>

    const signature = this.generateSignature(cleanData)

    return {
      ...paymentData,
      signature,
    }
  }

  getPaymentUrl(): string {
    return this.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"
  }

  validateSignature(data: Record<string, string>, receivedSignature: string): boolean {
    const { signature, ...dataWithoutSignature } = data
    const calculatedSignature = this.generateSignature(dataWithoutSignature)
    return calculatedSignature === receivedSignature
  }

  // Additional PayFast security checks
  validateIPNRequest(requestHeaders: Headers, clientIP: string): boolean {
    // Check if request is from PayFast
    const validHosts = ["www.payfast.co.za", "sandbox.payfast.co.za"]
    
    // In production, validate the source IP
    // PayFast publishes a list of valid IPs
    const payfastIPs = [
      "52.31.114.135",
      "52.49.113.86", 
      "52.49.114.205",
      "52.211.133.67",
      "52.211.146.217"
    ]
    
    return payfastIPs.includes(clientIP)
  }
}

export const payfast = new PayFastService()
