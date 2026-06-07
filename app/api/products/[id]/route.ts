import { type NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name, slug),
        product_images(id, image_url, storage_path, alt_text, is_primary, display_order),
        product_variants(id, variant_type, variant_name, variant_value, color_hex, price_modifier, stock_quantity, is_available, display_order)
      `)
      .eq("id", id)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      name,
      description,
      price,
      stock_quantity,
      image_url,
      is_active,
      is_featured,
      category_id,
      colors,
      sizes,
    } = body

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (price !== undefined) updates.price = Number.parseFloat(price)
    if (stock_quantity !== undefined) updates.stock_quantity = Number.parseInt(stock_quantity)
    if (image_url !== undefined) updates.image_url = image_url
    if (is_active !== undefined) updates.is_active = is_active
    if (is_featured !== undefined) updates.is_featured = is_featured
    if (category_id !== undefined) updates.category_id = category_id
    if (colors !== undefined) updates.colors = colors
    if (sizes !== undefined) updates.sizes = sizes

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Soft delete by setting is_active = false
    const { error } = await supabaseAdmin
      .from("products")
      .update({ is_active: false })
      .eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
