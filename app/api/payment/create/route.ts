import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    // Get order details
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create payment data
    const paymentData = payfast.createPaymentData({
      orderId: order.order_number,
      customerName:
        `${order.billing_address?.first_name || ""} ${order.billing_address?.last_name || ""}`.trim() || "Customer",
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      amount: order.total_amount,
      description: `Order ${order.order_number} - ${order.order_items?.length || 0} items`,
    })

    // Update order with payment reference
    await supabase
      .from("orders")
      .update({
        payment_reference: order.order_number,
        payment_method: "payfast",
      })
      .eq("id", orderId)

    return NextResponse.json({
      paymentUrl: payfast.getPaymentUrl(),
      paymentData,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
