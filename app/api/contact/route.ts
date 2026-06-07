import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || "missing_key")
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    if (!firstName || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://paitonsboutique.co.za"

    // Owner notification — critical, fail the request if this doesn't send
    await resend.emails.send({
      from: "Paitons Boutique Website <orders@paitonsboutique.co.za>",
      to: ["hello@paitonsboutique.co.za"],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">New Contact Form Message</h2>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
            <p><strong>From:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">${message}</p>
          </div>
        </div>
      `,
    })

    // Auto-reply to sender — best effort, don't fail the request if this errors
    resend.emails
      .send({
        from: "Paitons Boutique <hello@paitonsboutique.co.za>",
        to: [email],
        subject: "We received your message - Paitons Boutique",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">Message Received!</h2>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
              <p>Dear ${firstName},</p>
              <p>Thank you for reaching out to Paitons Boutique! We've received your message and will get back to you within 24 hours.</p>
              <p><strong>Your message subject:</strong> ${subject}</p>
              <p>In the meantime, feel free to browse our beautiful collection:</p>
              <a href="${appUrl}/products"
                 style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                Browse Collection
              </a>
              <p style="color: #6b7280; font-size: 14px;">With love from Durban, KZN ❤️<br>Paitons Boutique</p>
            </div>
          </div>
        `,
      })
      .catch((err) => console.error("Auto-reply failed (non-critical):", err))

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
