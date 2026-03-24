import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/database"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get order from database using client_reference_id
    const orderId = session.client_reference_id

    if (!orderId) {
      return NextResponse.json({ error: "Order reference not found" }, { status: 400 })
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if order has already been processed
    if (order.payment_status === "paid") {
      return NextResponse.json({
        order_number: order.order_number,
        already_processed: true,
      })
    }

    // Update order status
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_reference: session.payment_intent as string,
      })
      .eq("id", orderId)

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(orderId)
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
    }

    return NextResponse.json({
      order_number: order.order_number,
      already_processed: false,
    })

  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
