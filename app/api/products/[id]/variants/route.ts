import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission } from "@/lib/rbac"
import { validateVariant, groupVariantsByType } from "@/lib/variants"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params

    const { data: variants, error: variantsError } = await supabaseAdmin
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true })

    if (variantsError) {
      return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 })
    }

    const { data: combinations } = await supabaseAdmin
      .from("variant_combinations")
      .select("*")
      .eq("product_id", productId)

    const grouped = groupVariantsByType(variants ?? [])
    grouped.combinations = combinations ?? []

    return NextResponse.json({ success: true, data: grouped })
  } catch (error) {
    console.error("Variants GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "products:edit")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const errors = validateVariant(body)
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    // Get max display_order
    const { data: last } = await supabaseAdmin
      .from("product_variants")
      .select("display_order")
      .eq("product_id", productId)
      .eq("variant_type", body.variant_type)
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle()

    const displayOrder = (last?.display_order ?? -1) + 1

    const { data: variant, error } = await supabaseAdmin
      .from("product_variants")
      .insert({
        product_id: productId,
        variant_type: body.variant_type,
        variant_name: body.variant_name,
        variant_value: body.variant_value,
        color_hex: body.color_hex ?? null,
        price_modifier: body.price_modifier ?? 0,
        stock_quantity: body.stock_quantity ?? 0,
        is_available: body.is_available ?? true,
        display_order: displayOrder,
        sku_suffix: body.sku_suffix ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("Variant create error:", error)
      return NextResponse.json({ error: "Failed to create variant" }, { status: 500 })
    }

    await supabaseAdmin.from("staff_audit_log").insert({
      admin_user_id: session.userId,
      action: "variant_created",
      target_user_id: null,
      details: { product_id: productId, variant_id: variant.id },
    })

    return NextResponse.json({ success: true, data: variant }, { status: 201 })
  } catch (error) {
    console.error("Variants POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
