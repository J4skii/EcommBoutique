import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission } from "@/lib/rbac"
import { deleteFile, BUCKETS } from "@/lib/supabase-storage"

type Params = { params: Promise<{ id: string; imageId: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id: productId, imageId } = await params
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
    const allowed = ["alt_text", "is_primary", "image_url", "storage_path"]
    const updates: Record<string, any> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // If setting as primary, unset all others first
    if (updates.is_primary === true) {
      await supabaseAdmin
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId)
        .neq("id", imageId)
    }

    const { data: image, error } = await supabaseAdmin
      .from("product_images")
      .update(updates)
      .eq("id", imageId)
      .eq("product_id", productId)
      .select()
      .single()

    if (error) {
      console.error("Image update error:", error)
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: image })
  } catch (error) {
    console.error("Image PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id: productId, imageId } = await params
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

    // Get image details before deleting
    const { data: image } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .eq("product_id", productId)
      .single()

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Delete from storage if we have the path
    if (image.storage_path) {
      try {
        await deleteFile(image.storage_path, BUCKETS.PRODUCT_IMAGES)
      } catch {
        // Log but don't fail if storage delete fails
        console.error("Storage delete failed for", image.storage_path)
      }
    }

    const { error } = await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("id", imageId)
      .eq("product_id", productId)

    if (error) {
      console.error("Image DB delete error:", error)
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    // If the deleted image was primary, promote the next one
    if (image.is_primary) {
      const { data: remaining } = await supabaseAdmin
        .from("product_images")
        .select("id")
        .eq("product_id", productId)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (remaining) {
        await supabaseAdmin
          .from("product_images")
          .update({ is_primary: true })
          .eq("id", remaining.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Image DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
