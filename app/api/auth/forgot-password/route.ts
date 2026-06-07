import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { createToken } from "@/lib/tokens"
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  // 3 requests per IP per hour — prevents email bombing
  const ip = getIP(request)
  const rl = rateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    // Always return success — prevents email enumeration
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("id, first_name, email, password_hash")
      .eq("email", email)
      .single()

    if (!customer) {
      return NextResponse.json({ success: true })
    }

    // Include first 16 chars of current password hash so the token is
    // automatically invalidated once the password is changed
    const pwFingerprint = (customer.password_hash as string).slice(0, 16)

    const token = createToken(
      {
        type: "reset",
        customerId: customer.id,
        email: customer.email,
        pwf: pwFingerprint,
      },
      60 * 60 // 1 hour
    )

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY || "missing_key")

    await resend.emails.send({
      from: "Paitons Boutique <hello@paitonsboutique.co.za>",
      to: [customer.email],
      subject: "Reset your password - Paitons Boutique",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">
              🔒 Reset Your Password
            </h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
            <p>Hi ${customer.first_name},</p>
            <p>We received a request to reset your Paitons Boutique password. Click the button below to choose a new password:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                 style="background: #ec4899; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.
            </p>
            <p style="color: #6b7280; font-size: 12px; word-break: break-all;">
              Or copy this link: ${resetUrl}
            </p>
            <p style="color: #9ca3af; font-size: 13px;">With love from Durban, KZN ❤️<br>Paitons Boutique</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
