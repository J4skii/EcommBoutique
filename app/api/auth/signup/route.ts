import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, password } = body

    // Validation
    if (!first_name || !last_name || !phone || !password) {
      return NextResponse.json(
        { error: "First name, last name, phone, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Validate phone number format (should be 11-12 digits starting with 27)
    const phoneDigits = phone.replace(/\D/g, "")
    if (!phoneDigits.startsWith("27") || phoneDigits.length < 11) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const { data: existingPhone } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .single()

    if (existingPhone) {
      return NextResponse.json(
        { error: "This phone number is already registered" },
        { status: 409 }
      )
    }

    // Check if email already exists (if provided)
    if (email) {
      const { data: existingEmail } = await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("email", email)
        .single()

      if (existingEmail) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 409 }
        )
      }
    }

    // Hash password
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex")

    // Create customer
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .insert({
        first_name,
        last_name,
        email: email || null,
        phone,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Account created successfully",
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
      },
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
