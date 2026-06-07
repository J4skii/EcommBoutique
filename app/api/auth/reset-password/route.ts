import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { verifyToken } from "@/lib/tokens"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || payload.type !== "reset") {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      )
    }

    const customerId = payload.customerId as string
    const pwFingerprint = payload.pwf as string

    // Fetch current customer to verify the password hasn't already been reset
    const { data: customer, error: fetchError } = await supabaseAdmin
      .from("customers")
      .select("id, password_hash")
      .eq("id", customerId)
      .single()

    if (fetchError || !customer) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // If the password was already changed since this token was issued, reject it
    const currentFingerprint = (customer.password_hash as string).slice(0, 16)
    if (currentFingerprint !== pwFingerprint) {
      return NextResponse.json(
        { error: "This reset link has already been used. Please request a new one." },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = crypto.createHash("sha256").update(password).digest("hex")

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from("customers")
      .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
      .eq("id", customerId)

    if (updateError) {
      console.error("Password reset update error:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Invalidate all existing sessions for this customer
    await supabaseAdmin.from("customer_sessions").delete().eq("customer_id", customerId)

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
