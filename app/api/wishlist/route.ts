import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const { data: wishlistItem, error } = await supabase
      .from("wishlist_items")
      .insert({
        customer_id,
        product_id,
      })
      .select()
      .single()

    if (error) {
      console.error("Wishlist error:", error)
      return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
    }

    return NextResponse.json({ wishlistItem })
  } catch (error) {
    console.error("Wishlist API error:", error)
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
    console.error("Wishlist API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
