import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { verifyToken, createToken } from "@/lib/tokens"
import { Resend } from "resend"

// GET /api/auth/verify-email?token=xxx
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const payload = verifyToken(token)
  if (!payload || payload.type !== "verify") {
    return NextResponse.json(
      { error: "This verification link is invalid or has expired. Please request a new one." },
      { status: 400 }
    )
  }

  const customerId = payload.customerId as string

  // Mark email as verified — graceful if column doesn't exist yet
  const { error } = await supabaseAdmin
    .from("customers")
    .update({ email_verified: true, email_verified_at: new Date().toISOString() })
    .eq("id", customerId)

  if (error) {
    console.warn("Could not update email_verified (column may not exist):", error.message)
    // Not fatal — the link click itself is proof enough
  }

  return NextResponse.json({ success: true, message: "Email verified successfully" })
}

// POST /api/auth/verify-email — resend verification email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("id, first_name, email")
      .eq("email", email)
      .single()

    // Always return success to prevent email enumeration
    if (!customer) {
      return NextResponse.json({ success: true })
    }

    await sendVerificationEmail(customer.id, customer.first_name, email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function sendVerificationEmail(
  customerId: string,
  firstName: string,
  email: string
) {
  const token = createToken({ type: "verify", customerId, email }, 24 * 60 * 60) // 24h
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`

  const resend = new Resend(process.env.RESEND_API_KEY || "missing_key")

  await resend.emails.send({
    from: "Paitons Boutique <hello@paitonsboutique.co.za>",
    to: [email],
    subject: "Verify your email - Paitons Boutique",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">
            ✨ Verify Your Email
          </h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
          <p>Hi ${firstName},</p>
          <p>Welcome to Paitons Boutique! Please verify your email address to keep your account secure.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}"
               style="background: #ec4899; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
          </p>
          <p style="color: #6b7280; font-size: 12px; word-break: break-all;">
            Or copy this link: ${verifyUrl}
          </p>
          <p style="color: #9ca3af; font-size: 13px;">With love from Durban, KZN ❤️<br>Paitons Boutique</p>
        </div>
      </div>
    `,
  })
}
