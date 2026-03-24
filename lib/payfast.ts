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
  signature?: string
}

export interface OnsitePaymentData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  amount: number
  description: string
  returnUrl?: string
  cancelUrl?: string
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

  generateSignature(data: Record<string, string>, passphrase: string = ''): string {
    // PayFast signature: Sort alphabetically, skip empty values, use + for spaces
    const pairs: string[] = []
    const sortedKeys = Object.keys(data).sort()

    for (const key of sortedKeys) {
      // Skip empty values and the signature itself
      if (data[key] === '' || key === 'signature') continue

      // URL encode, but use + for spaces (PayFast specific)
      const encoded = encodeURIComponent(data[key]).replace(/%20/g, '+')
      pairs.push(`${key}=${encoded}`)
    }

    // Join with &
    let signatureString = pairs.join('&')

    // Append passphrase if set
    if (passphrase) {
      signatureString += `&passphrase=${encodeURIComponent(passphrase)}`
    }

    console.log('String to hash:', signatureString)

    return crypto.createHash('md5').update(signatureString).digest('hex')
  }

  createPaymentData(orderData: {
    orderId: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    amount: number
    description: string
  }): Record<string, any> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Format cell number for PayFast (must be SA format: 27xxxxxxxxx)
    let cellNumber = ""
    if (orderData.customerPhone) {
      // Remove all non-digits
      const phoneDigits = orderData.customerPhone.replace(/\D/g, '')
      // If starts with 0, replace with 27
      if (phoneDigits.startsWith('0')) {
        cellNumber = '27' + phoneDigits.substring(1)
      } else if (phoneDigits.startsWith('27')) {
        cellNumber = phoneDigits
      } else if (phoneDigits.startsWith('2') && phoneDigits.length === 11) {
        cellNumber = phoneDigits
      } else if (phoneDigits.length >= 9) {
        cellNumber = '27' + phoneDigits.slice(-9)
      }
      // Validate it's 11 digits
      if (cellNumber.length !== 11 || !/^27\d{9}$/.test(cellNumber)) {
        cellNumber = ""
      }
    }

    // Build payment data object - MANDATORY fields only for signature compatibility
    const paymentData: Record<string, string> = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      notify_url: `${baseUrl}/api/payment/notify`,
      name_first: orderData.customerName.split(" ")[0] || "Customer",
      name_last: orderData.customerName.split(" ").slice(1).join(" ") || "",
      email_address: orderData.customerEmail,
      m_payment_id: orderData.orderId,
      amount: orderData.amount.toFixed(2),
      item_name: "Paitons Boutique Order",
      item_description: orderData.description,
    }

    // Only add cell_number if it has a valid value
    if (cellNumber) {
      paymentData.cell_number = cellNumber
    }

    // Generate signature with passphrase
    const signature = this.generateSignature(paymentData, this.passphrase)

    // Return with signature
    const result: Record<string, any> = { ...paymentData, signature }
    if (cellNumber) {
      result.cell_number = cellNumber
    }
    return result
  }

  getPaymentUrl(): string {
    return this.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"
  }

  getOnsitePaymentUrl(): string {
    return this.sandbox ? "https://sandbox.payfast.co.za/onsite/process" : "https://www.payfast.co.za/onsite/process"
  }

  // Generate signature for onsite payments (order matters - must match PayFast documentation)
  generateOnsiteSignature(data: Record<string, string>): string {
    // For onsite payments, we use the order as specified in the docs
    // Not alphabetical - use the order fields appear
    const pairs: string[] = []

    for (const [key, value] of Object.entries(data)) {
      if (value === '' || key === 'signature') continue
      // URL encode, but use + for spaces (PayFast specific)
      const encoded = encodeURIComponent(value).replace(/%20/g, '+')
      pairs.push(`${key}=${encoded}`)
    }

    let signatureString = pairs.join('&')

    // Append passphrase if set
    if (this.passphrase) {
      signatureString += `&passphrase=${encodeURIComponent(this.passphrase)}`
    }

    return crypto.createHash('md5').update(signatureString).digest('hex')
  }

  // Create payment data for onsite payments
  createOnsitePaymentData(orderData: OnsitePaymentData): Record<string, string> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Format cell number for PayFast (must be SA format: 27xxxxxxxxx)
    let cellNumber = ""
    if (orderData.customerPhone) {
      const phoneDigits = orderData.customerPhone.replace(/\D/g, '')
      if (phoneDigits.startsWith('0')) {
        cellNumber = '27' + phoneDigits.substring(1)
      } else if (phoneDigits.startsWith('27')) {
        cellNumber = phoneDigits
      } else if (phoneDigits.startsWith('2') && phoneDigits.length === 11) {
        cellNumber = phoneDigits
      } else if (phoneDigits.length >= 9) {
        cellNumber = '27' + phoneDigits.slice(-9)
      }
      if (cellNumber.length !== 11 || !/^27\d{9}$/.test(cellNumber)) {
        cellNumber = ""
      }
    }

    // Build payment data for onsite - order matters for signature!
    const paymentData: Record<string, string> = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: orderData.returnUrl || `${baseUrl}/payment/success`,
      cancel_url: orderData.cancelUrl || `${baseUrl}/payment/cancel`,
      notify_url: `${baseUrl}/api/payment/notify`,
      name_first: orderData.customerName.split(" ")[0] || "Customer",
      name_last: orderData.customerName.split(" ").slice(1).join(" ") || "",
      email_address: orderData.customerEmail,
      m_payment_id: orderData.orderId,
      amount: orderData.amount.toFixed(2),
      item_name: "Monica's Bow Boutique Order",
      item_description: orderData.description,
    }

    // Add cell number if valid
    if (cellNumber) {
      paymentData.cell_number = cellNumber
    }

    // Generate signature
    const signature = this.generateOnsiteSignature(paymentData)
    paymentData.signature = signature

    return paymentData
  }

  // Create payment identifier (UUID) for onsite payments
  async createOnsitePaymentIdentifier(orderData: OnsitePaymentData): Promise<{ uuid: string; paymentData: Record<string, string> }> {
    const paymentData = this.createOnsitePaymentData(orderData)

    // Log payment data for debugging
    console.log("PayFast payment data:", paymentData)

    // Convert to URL-encoded string
    const paramString = Object.entries(paymentData)
      .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`)
      .join('&')

    console.log("PayFast param string:", paramString)

    const url = this.getOnsitePaymentUrl()
    console.log("PayFast API URL:", url)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: paramString,
      })

      console.log("PayFast response status:", response.status)
      console.log("PayFast response status text:", response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("PayFast error response:", errorText)
        throw new Error(`PayFast API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("PayFast response data:", data)

      if (!data.uuid) {
        throw new Error('No UUID returned from PayFast. Response: ' + JSON.stringify(data))
      }

      return { uuid: data.uuid, paymentData }
    } catch (error) {
      console.error('Error creating PayFast onsite payment:', error)
      throw error
    }
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
