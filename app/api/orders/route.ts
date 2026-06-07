import { type NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = searchParams.get("limit")
  const customer_id = searchParams.get("customer_id")
  const customer_email = searchParams.get("customer_email")
  const email = searchParams.get("email")
  const orderNumber = searchParams.get("order_number")

  try {
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name, image_url)
        )
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (customer_id) {
      query = query.eq("customer_id", customer_id)
    }

    if (customer_email) {
      query = query.eq("customer_email", customer_email)
    }

    if (email) {
      query = query.eq("customer_email", email)
    }

    if (orderNumber) {
      query = query.eq("order_number", orderNumber)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_email, customer_phone, items, shipping_address, billing_address, payment_method } = body

    // Generate order number
    const orderNumber = `MON-${Date.now()}`

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.unit_price * item.quantity
    }

    const shipping_cost = subtotal >= 300 ? 0 : 50
    const tax_amount = 0
    const discount_amount = 0

    const total_amount = subtotal + shipping_cost + tax_amount

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
        payment_method,
        shipping_address,
        billing_address,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      selected_color: item.selected_color,
      selected_size: item.selected_size,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Update product stock
    for (const item of items) {
      await supabase.rpc("decrement_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
