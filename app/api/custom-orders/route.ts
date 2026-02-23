import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { sendCustomOrderNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, colors, size, quantity, special_requests, is_rush_order } =
      body

    // Calculate estimated price based on size and quantity
    const sizePrice = {
      small: 35,
      medium: 45,
      large: 55,
      xl: 65,
    }

    const basePrice = sizePrice[size as keyof typeof sizePrice] || 45
    const estimated_price = basePrice * quantity + (is_rush_order ? 50 : 0)

    const { data: customOrder, error } = await supabase
      .from("custom_order_requests")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        colors,
        size,
        quantity,
        special_requests,
        is_rush_order,
        estimated_price,
        status: "submitted",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating custom order:", error)
      return NextResponse.json({ error: "Failed to create custom order" }, { status: 500 })
    }

    // Send email notifications
    try {
      await sendCustomOrderNotification(customOrder.id)
    } catch (emailError) {
      console.error("Failed to send custom order notification:", emailError)
    }

    // TODO: Send confirmation email to customer

    return NextResponse.json({ customOrder }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: customOrders, error } = await supabase
      .from("custom_order_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching custom orders:", error)
      return NextResponse.json({ error: "Failed to fetch custom orders" }, { status: 500 })
    }

    return NextResponse.json({ customOrders })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
