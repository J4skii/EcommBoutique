import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId") || searchParams.get("customer_id")
    const customerEmail = searchParams.get("customerEmail")

    if (!customerId && !customerEmail) {
      return NextResponse.json({ error: "customerId or customerEmail required" }, { status: 400 })
    }

    let resolvedCustomerId = customerId

    if (!resolvedCustomerId && customerEmail) {
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", customerEmail)
        .single()
      if (!customer) {
        return NextResponse.json({ success: true, data: [], count: 0, wishlistItems: [] })
      }
      resolvedCustomerId = customer.id
    }

    const { data, error } = await supabase
      .from("wishlist_items")
      .select(`
        id,
        customer_id,
        product_id,
        created_at,
        products (
          id,
          name,
          description,
          price,
          image_url,
          image_urls,
          stock_quantity,
          category,
          colors,
          sizes,
          is_featured,
          is_active,
          sku
        )
      `)
      .eq("customer_id", resolvedCustomerId!)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Wishlist fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
    }

    // Filter out inactive products
    const filtered = (data || []).filter((item: any) => item.products?.is_active !== false)

    return NextResponse.json({ success: true, data: filtered, count: filtered.length, wishlistItems: filtered })
  } catch (error) {
    console.error("Wishlist GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }
    if (!product_id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // Verify product exists and is active
    const { data: product } = await supabase
      .from("products")
      .select("id, is_active")
      .eq("id", product_id)
      .single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Prevent duplicates
    const { data: existing } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("customer_id", customer_id)
      .eq("product_id", product_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 409 })
    }

    const { data: wishlistItem, error } = await supabase
      .from("wishlist_items")
      .insert({ customer_id, product_id })
      .select()
      .single()

    if (error) {
      console.error("Wishlist add error:", error)
      return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: wishlistItem }, { status: 201 })
  } catch (error) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("customer_id", customer_id)
      .eq("product_id", product_id)

    if (error) {
      console.error("Wishlist delete error:", error)
      return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
