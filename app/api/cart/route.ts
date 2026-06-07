import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, quantity = 1, selected_color, selected_size, customer_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    if (!product_id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // Verify product exists and has enough stock
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, stock_quantity, is_active")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product.is_active) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 })
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Check if item already exists in cart
    let query = supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("customer_id", customer_id)
      .eq("product_id", product_id)

    if (selected_color) {
      query = query.eq("selected_color", selected_color)
    } else {
      query = query.is("selected_color", null)
    }

    if (selected_size) {
      query = query.eq("selected_size", selected_size)
    } else {
      query = query.is("selected_size", null)
    }

    const { data: existing } = await query.maybeSingle()

    let cartItem
    if (existing) {
      // Update existing cart item
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) {
        console.error("Cart update error:", error)
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }
      cartItem = data
    } else {
      // Insert new cart item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ customer_id, product_id, quantity, selected_color: selected_color || null, selected_size: selected_size || null })
        .select()
        .single()

      if (error) {
        console.error("Cart insert error:", error)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }
      cartItem = data
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
          stock_quantity,
          is_active
        )
      `)
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Cart fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }

    // Filter out inactive products
    const activeItems = cartItems?.filter((item: any) => item.products?.is_active !== false) || []

    return NextResponse.json({ cartItems: activeItems })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get("id")
    let customer_id = searchParams.get("customer_id")

    // Also accept body for DELETE (some clients send body)
    if (!id) {
      try {
        const body = await request.json()
        id = body.id
        customer_id = body.customer_id
      } catch {
        // no body is fine
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Cart item ID required" }, { status: 400 })
    }

    let query = supabase.from("cart_items").delete().eq("id", id)

    // Add customer_id guard if provided for security
    if (customer_id) {
      query = query.eq("customer_id", customer_id)
    }

    const { error } = await query

    if (error) {
      console.error("Cart delete error:", error)
      return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    // Clear entire cart for a customer (used after successful order)
    const { error } = await supabase.from("cart_items").delete().eq("customer_id", customer_id)

    if (error) {
      console.error("Cart clear error:", error)
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
