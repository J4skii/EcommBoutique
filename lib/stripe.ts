import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-04-30.basil",
    typescript: true,
})

// Client-side Stripe publishable key
let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    }
    return stripePromise
}

// Create a Stripe Checkout Session
export async function createStripeCheckoutSession(params: {
    orderId: string
    orderNumber: string
    customerEmail: string
    customerName: string
    items: Array<{
        name: string
        description?: string
        amount: number
        quantity: number
        image?: string
    }>
    successUrl: string
    cancelUrl: string
}) {
    const {
        orderId,
        orderNumber,
        customerEmail,
        customerName,
        items,
        successUrl,
        cancelUrl,
    } = params

    // Create line items for Stripe
    const line_items = items.map((item) => ({
        price_data: {
            currency: "zar",
            product_data: {
                name: item.name,
                description: item.description,
                images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.amount * 100), // Stripe uses cents
        },
        quantity: item.quantity,
    }))

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customerEmail,
        client_reference_id: orderId,
        line_items,
        metadata: {
            order_id: orderId,
            order_number: orderNumber,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
            allowed_countries: ["ZA"], // South Africa
        },
        billing_address_collection: "required",
    })

    return session
}

// Verify Stripe webhook signature
export function verifyStripeWebhookSignature(
    payload: string | Buffer,
    signature: string
): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
