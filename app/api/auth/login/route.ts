import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password } = body

    // Validation
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone number is required" },
        { status: 400 }
      )
    }

    // Hash password for comparison
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex")

    // Find customer by email or phone
    let query = supabaseAdmin.from("customers").select("*")
    
    if (email) {
      query = query.eq("email", email)
    } else if (phone) {
      query = query.eq("phone", phone)
    }

    const { data: customer, error } = await query.single()

    if (error || !customer) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    if (customer.password_hash !== passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex")

    // Store session
    await supabaseAdmin.from("customer_sessions").insert({
      customer_id: customer.id,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })

    return NextResponse.json({
      token,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
      },
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
