import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const category = searchParams.get("category")
  const limit = searchParams.get("limit")
  const search = searchParams.get("search")

  try {
    let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false })

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.textSearch("name", search)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: products, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, stock_quantity, colors, sizes, is_featured, image_url, weight_grams } = body

    // Generate SKU
    const sku = `BOW-${name.toUpperCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-3)}`

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price: Number.parseFloat(price),
        stock_quantity: Number.parseInt(stock_quantity),
        colors,
        sizes,
        is_featured: is_featured || false,
        image_url,
        sku,
        weight_grams: weight_grams ? Number.parseInt(weight_grams) : null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
