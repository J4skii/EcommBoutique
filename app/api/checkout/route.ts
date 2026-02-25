import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customer_email, 
      customer_phone,
      items, 
      shipping_address, 
      billing_address,
      discount_code 
    } = body

    // Validate required fields
    if (!customer_email || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }

    // Calculate discount
    let discount_amount = 0
    if (discount_code) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discount_code.toUpperCase())
        .eq("is_active", true)
        .single()

      if (discount) {
        if (discount.type === "percentage") {
          discount_amount = (subtotal * discount.value) / 100
        } else if (discount.type === "fixed_amount") {
          discount_amount = discount.value
        }
        // Ensure discount doesn't exceed subtotal
        discount_amount = Math.min(discount_amount, subtotal)
      }
    }

    // Calculate shipping and tax
    const shipping_cost = subtotal >= 300 ? 0 : 50
    const tax_amount = 0 // No VAT for small business
    const total_amount = subtotal + shipping_cost + tax_amount - discount_amount

    // Generate order number
    const orderNumber = `PAI-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email,
        customer_phone,
        subtotal,
        shipping_cost,
        tax_amount,
        discount_amount,
        total_amount,
        shipping_address,
        billing_address: billing_address || shipping_address,
        status: "pending",
        payment_status: "pending",
        payment_method: "payfast",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      selected_color: item.selected_color,
      selected_size: item.selected_size,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Rollback order
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      )
    }

    // Create PayFast payment data
    const paymentData = payfast.createPaymentData({
      orderId: orderNumber,
      customerName: `${shipping_address.first_name} ${shipping_address.last_name}`,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      amount: total_amount,
      description: `Order ${orderNumber} - ${items.length} items`,
    })

    // Clear customer's cart after successful order creation
    // Note: You might want to do this after payment confirmation instead

    return NextResponse.json({
      order: {
        id: order.id,
        order_number: orderNumber,
        total_amount,
      },
      paymentUrl: payfast.getPaymentUrl(),
      paymentData,
    })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
