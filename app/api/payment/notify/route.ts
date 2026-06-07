import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { payfast } from "@/lib/payfast"
import { sendOrderConfirmationEmail } from "@/lib/email"

// PayFast valid IPs (from PayFast docs)
const PAYFAST_IPS = [
  "197.97.145.144",
  "197.97.145.145",
  "197.97.145.146",
  "197.97.145.147",
  "197.97.145.148",
  "197.97.145.149",
  "197.97.145.150",
  "197.97.145.151",
  "52.31.114.135",
  "52.49.113.86",
  "52.49.114.205",
  "52.211.133.67",
  "52.211.146.217",
  // sandbox IPs
  "127.0.0.1",
  "::1",
]

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || ""
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body for PayFast POST-back validation (must use the same bytes)
    const rawBody = await request.text()

    // Parse form-encoded body into a key/value map
    const data: Record<string, string> = {}
    for (const pair of rawBody.split("&")) {
      const eqIdx = pair.indexOf("=")
      if (eqIdx === -1) continue
      const key = decodeURIComponent(pair.slice(0, eqIdx).replace(/\+/g, " "))
      const value = decodeURIComponent(pair.slice(eqIdx + 1).replace(/\+/g, " "))
      data[key] = value
    }

    console.log("PayFast IPN received for payment id:", data.m_payment_id ?? "(unknown)")

    // IP validation in production
    if (process.env.NODE_ENV === "production") {
      const clientIP = getClientIP(request)
      if (!PAYFAST_IPS.includes(clientIP)) {
        console.error(`PayFast IPN rejected - IP not whitelisted: ${clientIP}`)
        return new NextResponse("Invalid source", { status: 403 })
      }
    }

    // 1. Validate IPN signature (uses passphrase automatically)
    const isSignatureValid = payfast.validateSignature(data, data.signature)
    if (!isSignatureValid) {
      console.error("PayFast IPN: invalid signature for payment", data.m_payment_id ?? "(unknown)")
      return new NextResponse("Invalid signature", { status: 400 })
    }

    // 2. Perform PayFast server-side POST-back validation
    const isPayFastValid = await payfast.validateWithPayFast(rawBody)
    if (!isPayFastValid) {
      console.error("PayFast IPN: server validation failed for payment", data.m_payment_id ?? "(unknown)")
      return new NextResponse("PayFast validation failed", { status: 400 })
    }

    // 3. Verify merchant id matches configured credentials
    if (data.merchant_id !== payfast.getMerchantId()) {
      console.error("PayFast IPN: merchant_id mismatch")
      return new NextResponse("Merchant id mismatch", { status: 400 })
    }

    const { payment_status, m_payment_id, pf_payment_id, amount_gross } = data

    // 4. Look up the order
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", m_payment_id)
      .single()

    if (error || !order) {
      console.error("Order not found:", m_payment_id)
      return new NextResponse("Order not found", { status: 404 })
    }

    // Validate the amount matches (prevents amount tampering)
    const expectedAmount = order.total_amount.toFixed(2)
    const receivedAmount = parseFloat(amount_gross || "0").toFixed(2)
    if (expectedAmount !== receivedAmount) {
      console.error(`Amount mismatch for ${m_payment_id}: expected ${expectedAmount}, got ${receivedAmount}`)
      return new NextResponse("Amount mismatch", { status: 400 })
    }

    // 5. Idempotency: skip if already in final state
    const alreadyPaid = order.payment_status === "paid"

    // Determine new statuses
    let orderStatus: string = order.status
    let paymentStatus: string = order.payment_status ?? "pending"

    if (payment_status === "COMPLETE") {
      orderStatus = "confirmed"
      paymentStatus = "paid"

      // Send confirmation email only once (not on duplicate IPN)
      if (!alreadyPaid) {
        try {
          await sendOrderConfirmationEmail(order.id)
        } catch (emailError) {
          console.error("Failed to send order confirmation email:", emailError)
        }
      }
    } else if (payment_status === "FAILED") {
      orderStatus = "cancelled"
      paymentStatus = "failed"
    } else if (payment_status === "CANCELLED") {
      paymentStatus = "cancelled"
    }

    // 6. Update the order
    await supabaseAdmin
      .from("orders")
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        payment_reference: pf_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    console.log(`PayFast IPN: Order ${m_payment_id} → ${orderStatus}/${paymentStatus}`)

    // PayFast expects a plain 200 OK response
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Payment notification error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
