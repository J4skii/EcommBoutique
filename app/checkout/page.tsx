import { getCart } from "@/lib/cart"
import CheckoutClient from "./checkout-client"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Checkout",
  description: "Secure checkout for Monica's Bow Boutique.",
}

export default async function CheckoutPage() {
  const cart = await getCart()

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  // Transform cart data for client
  const cartItems = cart.items.map(item => ({
    id: item.id,
    product_id: item.productId,
    name: item.product.name,
    price: parseFloat(item.variant ? (parseFloat(item.product.price) + parseFloat(item.variant.priceAdjustment || "0")).toString() : item.product.price),
    quantity: item.quantity,
    image_url: item.product.imageUrl,
  }))

  return <CheckoutClient initialCartItems={cartItems} />
}
