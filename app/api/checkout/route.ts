import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { payfast } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_email,
      customer_phone,
      customer_id,
      items,
      shipping_address,
      billing_address,
    } = body

    if (!customer_email || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ── Stock validation ────────────────────────────────────────────────────
    // Pre-check every item before touching the orders table.
    // Returns a 400 early so the customer can fix the cart before retrying.
    for (const item of items) {
      const { data: product, error } = await supabaseAdmin
        .from("products")
        .select("name, stock_quantity, is_active")
        .eq("id", item.product_id)
        .single()

      if (error || !product) {
        return NextResponse.json({ error: "One or more products could not be found" }, { status: 400 })
      }
      if (!product.is_active) {
        return NextResponse.json(
          { error: `"${product.name}" is no longer available` },
          { status: 400 }
        )
      }
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `"${product.name}" only has ${product.stock_quantity} in stock (you requested ${item.quantity})`,
          },
          { status: 400 }
        )
      }
    }

    // ── Totals ──────────────────────────────────────────────────────────────
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }

    const shipping_cost = subtotal >= 300 ? 0 : 50
    const tax_amount = 0
    const total_amount = subtotal + shipping_cost + tax_amount

    const orderNumber = `PAI-${Date.now()}`

    // ── Create order ────────────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email,
        customer_phone,
        subtotal,
        shipping_cost,
        tax_amount,
        discount_amount: 0,
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
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // ── Create order items ──────────────────────────────────────────────────
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

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Rollback order
      await supabaseAdmin.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // ── Decrement stock ─────────────────────────────────────────────────────
    // Uses an optimistic lock (.gte filter) so concurrent orders can't push
    // stock negative: if stock was already taken, the update affects 0 rows.
    for (const item of items) {
      const { data: current } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single()

      if (current) {
        await supabaseAdmin
          .from("products")
          .update({
            stock_quantity: Math.max(0, current.stock_quantity - item.quantity),
          })
          .eq("id", item.product_id)
          .gte("stock_quantity", item.quantity)
      }
    }

    // ── Clear cart ──────────────────────────────────────────────────────────
    if (customer_id) {
      await supabaseAdmin.from("cart_items").delete().eq("customer_id", customer_id)
    }

    // ── Build PayFast form data ─────────────────────────────────────────────
    const paymentData = payfast.createPaymentData({
      orderId: orderNumber,
      customerName: `${shipping_address.first_name} ${shipping_address.last_name}`,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      amount: total_amount,
      description: `Order ${orderNumber} - ${items.length} item${items.length !== 1 ? "s" : ""}`,
    })

    return NextResponse.json({
      order: { id: order.id, order_number: orderNumber, total_amount },
      paymentUrl: payfast.getPaymentUrl(),
      paymentData,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
