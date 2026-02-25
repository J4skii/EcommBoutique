import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const category = searchParams.get("category")
  const categoryId = searchParams.get("categoryId")
  const limit = searchParams.get("limit")
  const search = searchParams.get("search")

  try {
    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    // Filter by category ID (new way)
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }
    // Filter by category slug/name (fallback)
    else if (category) {
      // Try to find category first
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .or(`slug.eq.${category},name.ilike.${category}`)
        .single()
      
      if (catData) {
        query = query.eq("category_id", catData.id)
      } else {
        // Fallback to old category column
        query = query.eq("category", category)
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
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
    const { 
      name, 
      description, 
      price, 
      stock_quantity, 
      colors, 
      sizes, 
      is_featured, 
      image_url, 
      weight_grams,
      category_id,
      category 
    } = body

    // Generate SKU
    const sku = `BOW-${name.toUpperCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-3)}`

    // Prepare insert data
    const insertData: any = {
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
    }

    // Handle category
    if (category_id) {
      insertData.category_id = category_id
      // Also get category name for backwards compatibility
      const { data: catData } = await supabase
        .from("categories")
        .select("name")
        .eq("id", category_id)
        .single()
      if (catData) {
        insertData.category = catData.name
      }
    } else if (category) {
      insertData.category = category
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert(insertData)
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
