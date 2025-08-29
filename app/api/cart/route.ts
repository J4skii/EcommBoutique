import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, quantity = 1, selected_color, selected_size, customer_id } = body

    // For now, we'll use session-based cart (you can implement customer_id later)
    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    // Check if product exists and has stock
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Add or update cart item
    const { data: cartItem, error } = await supabase
      .from("cart_items")
      .upsert({
        customer_id,
        product_id,
        quantity,
        selected_color,
        selected_size,
      })
      .select()
      .single()

    if (error) {
      console.error("Cart error:", error)
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
    }

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customer_id = searchParams.get("customer_id")

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq("customer_id", customer_id)

    if (error) {
      console.error("Cart fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
