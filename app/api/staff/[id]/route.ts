import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission, isValidRole } from "@/lib/rbac"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "staff:view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: staff, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, is_active, last_login_at, created_at")
      .eq("id", id)
      .single()

    if (error || !staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: staff })
  } catch (error) {
    console.error("Staff GET[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "staff:edit")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { role, is_active } = body

    if (role !== undefined && !isValidRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (role !== undefined) updates.role = role
    if (is_active !== undefined) updates.is_active = is_active

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data: updated, error } = await supabaseAdmin
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select("id, email, first_name, last_name, role, is_active")
      .single()

    if (error) {
      console.error("Staff update error:", error)
      return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 })
    }

    // Audit log
    await supabaseAdmin.from("staff_audit_log").insert({
      admin_user_id: session.userId,
      action: "staff_updated",
      target_user_id: id,
      details: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Staff PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "staff:delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
    }

    // Prevent deleting the last superadmin
    const { data: targetUser } = await supabaseAdmin
      .from("admin_users")
      .select("role")
      .eq("id", id)
      .single()

    if (targetUser?.role === "superadmin") {
      const { count } = await supabaseAdmin
        .from("admin_users")
        .select("id", { count: "exact", head: true })
        .eq("role", "superadmin")
        .eq("is_active", true)

      if ((count ?? 0) <= 1) {
        return NextResponse.json({ error: "Cannot delete the last superadmin" }, { status: 400 })
      }
    }

    const { error } = await supabaseAdmin.from("admin_users").delete().eq("id", id)

    if (error) {
      console.error("Staff delete error:", error)
      return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 })
    }

    await supabaseAdmin.from("staff_audit_log").insert({
      admin_user_id: session.userId,
      action: "staff_deleted",
      target_user_id: id,
      details: {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Staff DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
