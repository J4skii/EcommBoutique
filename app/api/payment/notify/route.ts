import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"
import { sendOrderConfirmationEmail } from "@/lib/email"

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

    // 1. Validate IPN signature (uses passphrase automatically)
    const isSignatureValid = payfast.validateSignature(data, data.signature)
    if (!isSignatureValid) {
      console.error("PayFast IPN: invalid signature for payment", data.m_payment_id ?? "(unknown)")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // 2. Perform PayFast server-side POST-back validation
    const isPayFastValid = await payfast.validateWithPayFast(rawBody)
    if (!isPayFastValid) {
      console.error("PayFast IPN: server validation failed for payment", data.m_payment_id ?? "(unknown)")
      return NextResponse.json({ error: "PayFast validation failed" }, { status: 400 })
    }

    // 3. Verify merchant id matches configured credentials
    if (data.merchant_id !== payfast.getMerchantId()) {
      console.error("PayFast IPN: merchant_id mismatch")
      return NextResponse.json({ error: "Merchant id mismatch" }, { status: 400 })
    }

    const { payment_status, m_payment_id, pf_payment_id, amount_gross } = data

    // 4. Look up the order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", m_payment_id)
      .single()

    if (error || !order) {
      console.error("PayFast IPN: order not found:", m_payment_id)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // 5. Verify amount_gross matches the stored order total (normalise to 2 decimals)
    if (payment_status === "COMPLETE") {
      const receivedAmount = Math.round(parseFloat(amount_gross ?? "0") * 100)
      const expectedAmount = Math.round(parseFloat(String(order.total_amount ?? "0")) * 100)
      if (receivedAmount !== expectedAmount) {
        console.error(
          `PayFast IPN: amount mismatch for order ${m_payment_id}: received ${receivedAmount}, expected ${expectedAmount}`
        )
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
      }
    }

    // 6. Idempotency: skip if already in final state
    const alreadyPaid = order.payment_status === "paid"

    // Determine new statuses
    let orderStatus: string = order.status
    let paymentStatusValue: string = order.payment_status ?? "pending"

    if (payment_status === "COMPLETE") {
      orderStatus = "confirmed"
      paymentStatusValue = "paid"
    } else if (payment_status === "FAILED" || payment_status === "CANCELLED") {
      paymentStatusValue = "failed"
    }

    // 7. Update the order
    await supabase
      .from("orders")
      .update({
        status: orderStatus,
        payment_status: paymentStatusValue,
        ...(pf_payment_id ? { payment_reference: pf_payment_id } : {}),
      })
      .eq("id", order.id)

    console.log(`PayFast IPN: order ${m_payment_id} updated to ${orderStatus}/${paymentStatusValue}`)

    // 8. Send confirmation email only once (not on duplicate IPN)
    if (payment_status === "COMPLETE" && !alreadyPaid) {
      try {
        await sendOrderConfirmationEmail(order.id)
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError)
      }
    }

    return NextResponse.json({ status: "OK" })
  } catch (error) {
    console.error("PayFast IPN handler error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
