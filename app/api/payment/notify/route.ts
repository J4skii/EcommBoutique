import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data: Record<string, string> = {}

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString()
    }

    console.log("PayFast notification received:", data)

    // Validate signature
    const isValid = payfast.validateSignature(data, data.signature)
    if (!isValid) {
      console.error("Invalid PayFast signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const { payment_status, m_payment_id, pf_payment_id, amount_gross } = data

    // Find order by payment reference
    const { data: order, error } = await supabase.from("orders").select("*").eq("order_number", m_payment_id).single()

    if (error || !order) {
      console.error("Order not found:", m_payment_id)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order based on payment status
    let orderStatus = order.status
    let paymentStatus = "pending"

    if (payment_status === "COMPLETE") {
      orderStatus = "confirmed"
      paymentStatus = "paid"

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(order.id)
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
      }
    } else if (payment_status === "FAILED" || payment_status === "CANCELLED") {
      paymentStatus = "failed"
    }

    // Update order
    await supabase
      .from("orders")
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        payment_reference: pf_payment_id,
      })
      .eq("id", order.id)

    console.log(`Order ${m_payment_id} updated: ${orderStatus}/${paymentStatus}`)

    return NextResponse.json({ status: "OK" })
  } catch (error) {
    console.error("Payment notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
