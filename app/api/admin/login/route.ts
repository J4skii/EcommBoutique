import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get admin user
    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    // In production, use bcrypt. For now, using SHA-256 as a simple hash
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")

    // For development/demo: also accept plaintext comparison
    // REMOVE THIS IN PRODUCTION
    const isValidPassword = 
      hashedPassword === admin.password_hash || 
      password === admin.password_hash

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex")

    // Store session in database (optional - for session management)
    await supabaseAdmin.from("admin_sessions").insert({
      admin_id: admin.id,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
    })

  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
