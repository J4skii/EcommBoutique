import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"

// Fetch bank details from database settings
async function getBankDetails() {
  const { data, error } = await supabase
    .from("store_settings")
    .select("setting_key, setting_value")
    .in("setting_key", [
      "bank_name",
      "account_number",
      "account_type",
      "branch_code",
      "account_holder",
      "payment_instructions",
    ])

  if (error) {
    console.error("Error fetching bank details:", error)
    // Return default fallback values
    return {
      bankName: "First National Bank",
      accountNumber: "1234567890",
      accountType: "Cheque",
      branchCode: "123456",
      accountHolder: "Monica's Bow Boutique",
      paymentInstructions: "Please make payment within 48 hours.",
    }
  }

  // Convert array to object
  const settings: Record<string, string> = {}
  for (const item of data || []) {
    settings[item.setting_key] = item.setting_value || ""
  }

  return {
    bankName: settings.bank_name || "First National Bank",
    accountNumber: settings.account_number || "1234567890",
    accountType: settings.account_type || "Cheque",
    branchCode: settings.branch_code || "123456",
    accountHolder: settings.account_holder || "Monica's Bow Boutique",
    paymentInstructions: settings.payment_instructions || "Please make payment within 48 hours.",
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_email,
      customer_phone,
      items,
      shipping_address,
      billing_address,
      discount_code,
      payment_method
    } = body

    // Validate required fields
    if (!customer_email || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }

    // Calculate discount
    let discount_amount = 0
    if (discount_code) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discount_code.toUpperCase())
        .eq("is_active", true)
        .single()

      if (discount) {
        if (discount.type === "percentage") {
          discount_amount = (subtotal * discount.value) / 100
        } else if (discount.type === "fixed_amount") {
          discount_amount = discount.value
        }
        discount_amount = Math.min(discount_amount, subtotal)
      }
    }

    const shipping_cost = subtotal >= 300 ? 0 : 50
    const tax_amount = 0
    const total_amount = subtotal + shipping_cost + tax_amount - discount_amount

    const orderNumber = `PAI-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email,
        customer_phone,
        subtotal,
        shipping_cost,
        tax_amount,
        discount_amount,
        total_amount,
        shipping_address,
        billing_address: billing_address || shipping_address,
        status: "pending",
        payment_status: "pending",
        payment_method: payment_method || "stripe",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      selected_color: item.selected_color,
      selected_size: item.selected_size,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      )
    }

    // Handle based on payment method
    if (payment_method === "eft") {
      // Fetch bank details from database
      const bankDetails = await getBankDetails()

      // Return EFT details for manual bank transfer
      return NextResponse.json({
        order: {
          id: order.id,
          order_number: orderNumber,
          total_amount,
        },
        paymentMethod: "eft",
        eftDetails: bankDetails,
      })
    } else if (payment_method === "payfast") {
      // Handle PayFast Onsite Payments - return UUID for modal
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

        // Create onsite payment and get UUID
        const { uuid, paymentData } = await payfast.createOnsitePaymentIdentifier({
          orderId: orderNumber,
          customerName: `${shipping_address.first_name} ${shipping_address.last_name}`,
          customerEmail: customer_email,
          customerPhone: customer_phone,
          amount: total_amount,
          description: `Order ${orderNumber} - ${items.length} items`,
          returnUrl: `${baseUrl}/payment/success?order=${orderNumber}`,
          cancelUrl: `${baseUrl}/payment/cancel?order=${orderNumber}`,
        })

        return NextResponse.json({
          order: {
            id: order.id,
            order_number: orderNumber,
            total_amount,
          },
          paymentMethod: "payfast",
          payfast: {
            uuid,
            paymentData,
          },
        })
      } catch (payError: any) {
        console.error("PayFast payment error:", payError)
        // Return payfast object with error so frontend can handle it
        // Also return paymentData so frontend can fall back to redirect
        const errorMessage = payError?.message || payError?.toString() || "Unknown error"

        // Get payment data even on error for fallback
        let paymentData = null
        try {
          paymentData = payfast.createPaymentData({
            orderId: orderNumber,
            customerName: `${shipping_address.first_name} ${shipping_address.last_name}`,
            customerEmail: customer_email,
            customerPhone: customer_phone,
            amount: total_amount,
            description: `Order ${orderNumber} - ${items.length} items`,
          })
        } catch (pdError) {
          console.error("Error creating payment data:", pdError)
        }

        return NextResponse.json({
          order: {
            id: order.id,
            order_number: orderNumber,
            total_amount,
          },
          paymentMethod: "payfast",
          payfast: {
            error: "Failed to initialize PayFast payment",
            details: errorMessage,
            paymentData,
          },
        })
      }
    } else {
      // Default to PayFast redirect (or handle Stripe if needed)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

        // Create PayFast payment data
        const paymentData = payfast.createPaymentData({
          orderId: orderNumber,
          customerName: `${shipping_address.first_name} ${shipping_address.last_name}`,
          customerEmail: customer_email,
          customerPhone: customer_phone,
          amount: total_amount,
          description: `Order ${orderNumber} - ${items.length} items`,
        })

        return NextResponse.json({
          order: {
            id: order.id,
            order_number: orderNumber,
            total_amount,
          },
          paymentUrl: payfast.getPaymentUrl(),
          paymentData,
        })
      } catch (payError) {
        // If payment fails, just return the order
        console.error("Payment error:", payError)
        return NextResponse.json({
          order: {
            id: order.id,
            order_number: orderNumber,
            total_amount,
          },
        })
      }
    }

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
