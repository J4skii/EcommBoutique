import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { getSession } from "@/lib/auth"
import { userHasPermission, isValidRole, type UserRole } from "@/lib/rbac"
import crypto from "crypto"

export async function GET() {
  try {
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
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Staff fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: staff, count: staff?.length ?? 0 })
  } catch (error) {
    console.error("Staff GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, is_active")
      .eq("id", session.userId)
      .single()

    if (!currentUser || !userHasPermission(currentUser as any, "staff:create")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { email, first_name, last_name, role } = body

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 })
    }

    if (!isValidRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "A staff member with this email already exists" }, { status: 409 })
    }

    // Create invitation
    const invitationCode = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from("staff_invitations")
      .insert({
        email,
        first_name,
        last_name,
        role,
        invitation_code: invitationCode,
        invited_by: session.userId,
        expires_at: expiresAt,
        status: "pending",
      })
      .select()
      .single()

    if (inviteError) {
      console.error("Invitation create error:", inviteError)
      return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
    }

    // Log action
    await supabaseAdmin.from("staff_audit_log").insert({
      admin_user_id: session.userId,
      action: "staff_invited",
      target_email: email,
      details: { role, first_name, last_name },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    return NextResponse.json({
      success: true,
      data: invitation,
      invitation_link: `${baseUrl}/admin/accept-invite?code=${invitationCode}`,
    }, { status: 201 })
  } catch (error) {
    console.error("Staff POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
