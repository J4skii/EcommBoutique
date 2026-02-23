import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = searchParams.get("limit")

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
    const { customer_email, customer_phone, items, shipping_address, billing_address, payment_method, discount_code } =
      body

    // Generate order number
    const orderNumber = `MON-${Date.now()}`

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.unit_price * item.quantity
    }

    const shipping_cost = subtotal >= 300 ? 0 : 50 // Free shipping over R300
    const tax_amount = 0 // No VAT for small business
    let discount_amount = 0

    // Apply discount code if provided
    if (discount_code) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discount_code)
        .eq("is_active", true)
        .single()

      if (discount) {
        if (discount.type === "percentage") {
          discount_amount = (subtotal * discount.value) / 100
        } else if (discount.type === "fixed_amount") {
          discount_amount = discount.value
        } else if (discount.type === "free_shipping") {
          // Free shipping already handled above
        }
      }
    }

    const total_amount = subtotal + shipping_cost + tax_amount - discount_amount

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

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const body = await request.json()
    const { status, payment_status } = body

    const updateData: Record<string, string> = {}
    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
