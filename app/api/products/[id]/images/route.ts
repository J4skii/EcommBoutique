import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission } from "@/lib/rbac"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params

    const { data: images, error } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: images ?? [], count: images?.length ?? 0 })
  } catch (error) {
    console.error("Images GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "products:upload_images")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { images } = body

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "images must be an array" }, { status: 400 })
    }

    // Update display_order for each image
    const updates = images.map(({ id, display_order }: { id: string; display_order: number }) =>
      supabaseAdmin
        .from("product_images")
        .update({ display_order })
        .eq("id", id)
        .eq("product_id", productId)
    )

    await Promise.all(updates)

    const { data: updated } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Images PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "products:upload_images")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { image_url, storage_path, alt_text, is_primary } = body

    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 })
    }

    // Get current image count for display_order
    const { count } = await supabaseAdmin
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId)

    // If setting as primary, unset others
    if (is_primary) {
      await supabaseAdmin
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId)
    }

    const { data: image, error } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: productId,
        image_url,
        storage_path: storage_path ?? null,
        alt_text: alt_text ?? null,
        is_primary: is_primary ?? (count === 0),
        display_order: count ?? 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Image create error:", error)
      return NextResponse.json({ error: "Failed to create image record" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: image }, { status: 201 })
  } catch (error) {
    console.error("Images POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
