"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal, itemCount } = useCart()
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const applyDiscount = () => {
    const validCodes: Record<string, { amount: number; type: "percentage" | "fixed" }> = {
      MONICA20: { amount: 20, type: "percentage" },
      WELCOME10: { amount: 10, type: "percentage" },
      FREESHIP300: { amount: 50, type: "fixed" },
    }

    const discount = validCodes[discountCode.toUpperCase() as keyof typeof validCodes]
    if (discount) {
      const discountAmount = discount.type === "percentage" ? (subtotal * discount.amount) / 100 : discount.amount
      setAppliedDiscount({ code: discountCode.toUpperCase(), amount: discountAmount })
    } else {
      alert("Invalid discount code")
    }
  }

  const discountAmount = appliedDiscount?.amount || 0
  const shippingCost = subtotal >= 300 ? 0 : 50
  const total = subtotal - discountAmount + shippingCost

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Discover Monica's beautiful handcrafted bows and add some to your cart!</p>
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
          <p className="text-gray-600 mt-2">{itemCount} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image_url || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
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
                          onClick={() => removeItem(item.product_id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            disabled={item.quantity >= item.stock_quantity}
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
