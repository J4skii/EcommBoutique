"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
  selected_color: string | null
  selected_size: string | null
  stock_quantity: number
}

// Get customer ID from localStorage
const getCustomerId = () => {
  if (typeof window === "undefined") return null
  let customerId = localStorage.getItem("customer_id")
  if (!customerId) {
    customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("customer_id", customerId)
  }
  return customerId
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const customerId = getCustomerId()
    if (!customerId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/cart?customer_id=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        // Transform cart items to include product details
        const items = data.cartItems?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || "Product",
          price: item.products?.price || 0,
          quantity: item.quantity,
          image_url: item.products?.image_url || "/placeholder.svg",
          selected_color: item.selected_color,
          selected_size: item.selected_size,
          stock_quantity: item.products?.stock_quantity || 0,
        })) || []
        setCartItems(items)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }

    setUpdating(id)
    try {
      const customerId = getCustomerId()
      const item = cartItems.find((i) => i.id === id)
      if (!item || !customerId) return

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: newQuantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size,
          customer_id: customerId,
        }),
      })

      if (response.ok) {
        setCartItems((items) =>
          items.map((item) => (item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock_quantity) } : item))
        )
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (id: string) => {
    try {
      // Note: You'll need to create a DELETE endpoint for cart items
      // For now, we'll just update the UI
      setCartItems((items) => items.filter((item) => item.id !== id))
      window.dispatchEvent(new Event("cart-updated"))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const applyDiscount = () => {
    const validCodes: Record<string, { amount: number; type: string }> = {
      PAITON20: { amount: 20, type: "percentage" },
      WELCOME10: { amount: 10, type: "percentage" },
      FREESHIP300: { amount: 50, type: "fixed" },
    }

    const discount = validCodes[discountCode.toUpperCase()]
    if (discount) {
      const discountAmount = discount.type === "percentage" ? (subtotal * discount.amount) / 100 : discount.amount
      setAppliedDiscount({ code: discountCode.toUpperCase(), amount: discountAmount })
    } else {
      alert("Invalid discount code")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedDiscount?.amount || 0
  const shippingCost = subtotal >= 300 ? 0 : 50
  const total = subtotal - discountAmount + shippingCost

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Discover Paiton's beautiful handcrafted bows and add some to your cart!</p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 text-pink-600 hover:text-pink-700">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800">
            Your <span className="font-semibold text-pink-600">Shopping Cart</span>
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.selected_color && <p>Color: {item.selected_color}</p>}
                            {item.selected_size && <p>Size: {item.selected_size}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          disabled={updating === item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            disabled={updating === item.id}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            disabled={item.quantity >= item.stock_quantity || updating === item.id}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-gray-800">R{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">R{item.price} each</p>
                        </div>
                      </div>

                      {item.stock_quantity <= 3 && item.stock_quantity > 0 && (
                        <Badge variant="outline" className="mt-2 text-orange-600 border-orange-200">
                          Only {item.stock_quantity} left in stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-pink-100 sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Code */}
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="border-pink-200"
                    />
                    <Button
                      variant="outline"
                      onClick={applyDiscount}
                      className="border-pink-200 text-pink-600 bg-transparent"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedDiscount && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ {appliedDiscount.code} applied (-R{appliedDiscount.amount.toFixed(2)})
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-R{appliedDiscount.amount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `R${shippingCost.toFixed(2)}`}</span>
                  </div>

                  {subtotal < 300 && (
                    <p className="text-xs text-gray-500">Add R{(300 - subtotal).toFixed(2)} more for free shipping</p>
                  )}
                </div>

                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>Total</span>
                  <span className="text-pink-600">R{total.toFixed(2)}</span>
                </div>

                <Button asChild className="w-full bg-pink-600 hover:bg-pink-700 mt-6">
                  <Link href="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>Secure checkout with PayFast</p>
                  <p>Free returns within 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
