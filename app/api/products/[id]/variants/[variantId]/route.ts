import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission } from "@/lib/rbac"

type Params = { params: Promise<{ id: string; variantId: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id: productId, variantId } = await params

    const { data: variant, error } = await supabaseAdmin
      .from("product_variants")
      .select("*")
      .eq("id", variantId)
      .eq("product_id", productId)
      .single()

    if (error || !variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: variant })
  } catch (error) {
    console.error("Variant GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id: productId, variantId } = await params
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "products:edit")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const allowed = ["variant_name", "variant_value", "color_hex", "price_modifier", "stock_quantity", "is_available", "display_order", "sku_suffix"]
    const updates: Record<string, any> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data: variant, error } = await supabaseAdmin
      .from("product_variants")
      .update(updates)
      .eq("id", variantId)
      .eq("product_id", productId)
      .select()
      .single()

    if (error) {
      console.error("Variant update error:", error)
      return NextResponse.json({ error: "Failed to update variant" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: variant })
  } catch (error) {
    console.error("Variant PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id: productId, variantId } = await params
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "products:delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete related combinations first
    await supabaseAdmin
      .from("variant_combinations")
      .delete()
      .or(`color_variant_id.eq.${variantId},size_variant_id.eq.${variantId}`)

    const { error } = await supabaseAdmin
      .from("product_variants")
      .delete()
      .eq("id", variantId)
      .eq("product_id", productId)

    if (error) {
      console.error("Variant delete error:", error)
      return NextResponse.json({ error: "Failed to delete variant" }, { status: 500 })
    }

    await supabaseAdmin.from("staff_audit_log").insert({
      admin_user_id: session.userId,
      action: "variant_deleted",
      target_user_id: null,
      details: { product_id: productId, variant_id: variantId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Variant DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
