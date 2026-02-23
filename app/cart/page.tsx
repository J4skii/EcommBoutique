import { getCart } from "@/lib/cart"
import CartClient from "./cart-client"

export const metadata = {
  title: "Shopping Cart",
  description: "View your shopping cart at Monica's Bow Boutique.",
}

export default async function CartPage() {
  const cart = await getCart()

  // Transform cart data for client
  const cartItems = cart ? cart.items.map(item => ({
    id: item.id, // This is cart item ID
    product_id: item.productId,
    name: item.product.name,
    price: parseFloat(item.variant ? (parseFloat(item.product.price) + parseFloat(item.variant.priceAdjustment || "0")).toString() : item.product.price),
    quantity: item.quantity,
    image_url: item.product.imageUrl,
    selected_color: item.variant?.color || null,
    selected_size: item.variant?.size || null,
    stock_quantity: item.variant ? item.variant.stockQuantity : item.product.stockQuantity,
  })) : []

  return <CartClient initialCartItems={cartItems} />
}
