import { type NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhookSignature } from "@/lib/stripe"
import { supabase } from "@/lib/database"
import { sendOrderConfirmationEmail } from "@/lib/email"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = verifyStripeWebhookSignature(body, signature)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get order ID from client_reference_id
        const orderId = session.client_reference_id
        
        if (!orderId) {
          console.error("No order reference found in session")
          return NextResponse.json({ error: "Order reference not found" }, { status: 400 })
        }

        // Update order to paid
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            payment_status: "paid",
            payment_reference: session.payment_intent as string,
          })
          .eq("id", orderId)

        if (updateError) {
          console.error("Error updating order:", updateError)
          return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
        }

        // Send confirmation email
        try {
          await sendOrderConfirmationEmail(orderId)
          console.log(`Order ${orderId} confirmation email sent`)
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError)
        }

        console.log(`Order ${orderId} payment completed via webhook`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log(`Payment failed: ${paymentIntent.id}`)
        
        // Optionally update order status to failed
        // You could look up the order using the payment intent metadata
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
