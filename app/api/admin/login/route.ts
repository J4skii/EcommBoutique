import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, password_hash, first_name, last_name, role, is_active")
      .eq("email", email.toLowerCase())
      .single()

    if (error || !admin || !admin.is_active) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password using SHA-256
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    if (hashedPassword !== admin.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last_login_at
    await supabaseAdmin
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", admin.id)

    // Create session payload encoded as base64 (matches middleware format)
    const sessionPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role || "superadmin",
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    }
    const sessionToken = `admin_${Buffer.from(JSON.stringify(sessionPayload)).toString("base64")}`

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role || "superadmin",
      },
    })

    // Set httpOnly cookie server-side
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
