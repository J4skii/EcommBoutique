"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
  selected_color: string | null
  selected_size: string | null
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

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("payfast")
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const customerId = getCustomerId()
    if (!customerId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        const items = data.cartItems?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || "Product",
          price: item.products?.price || 0,
          quantity: item.quantity,
          image_url: item.products?.image_url || "/placeholder.svg",
          selected_color: item.selected_color,
          selected_size: item.selected_size,
        })) || []
        setCartItems(items)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError("Failed to load cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: formData.get("email"),
          customer_phone: formData.get("phone"),
          items: cartItems.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selected_color: item.selected_color,
            selected_size: item.selected_size,
          })),
          shipping_address: {
            first_name: formData.get("firstName"),
            last_name: formData.get("lastName"),
            address: formData.get("address1"),
            address2: formData.get("address2"),
            city: formData.get("city"),
            province: formData.get("province"),
            postal_code: formData.get("postal"),
          },
          billing_address: sameAsShipping ? undefined : {
            first_name: formData.get("billFirstName"),
            last_name: formData.get("billLastName"),
            address: formData.get("billAddress1"),
            city: formData.get("billCity"),
            province: formData.get("billProvince"),
            postal_code: formData.get("billPostal"),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      if (data.paymentUrl && data.paymentData) {
        // Create and submit PayFast form
        const form = document.createElement("form")
        form.method = "POST"
        form.action = data.paymentUrl

        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = value as string
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        throw new Error("Payment initialization failed")
      }

    } catch (err: any) {
      console.error("Checkout error:", err)
      setError(err.message || "Failed to process checkout. Please try again.")
      setIsProcessing(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 300 ? 0 : 50
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl font-light text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
            <Link href="/products">Shop Now</Link>
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
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800">
            <span className="font-semibold text-pink-600">Checkout</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required className="border-pink-200" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" placeholder="+27 123 456 789" required className="border-pink-200" />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input id="address1" name="address1" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input id="address2" name="address2" className="border-pink-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="province">Province *</Label>
                      <Select name="province" required>
                        <SelectTrigger className="border-pink-200">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="Gauteng">Gauteng</SelectItem>
                          <SelectItem value="Western Cape">Western Cape</SelectItem>
                          <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                          <SelectItem value="Free State">Free State</SelectItem>
                          <SelectItem value="Limpopo">Limpopo</SelectItem>
                          <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                          <SelectItem value="North West">North West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal Code *</Label>
                      <Input id="postal" name="postal" required className="border-pink-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                      3
                    </div>
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="sameAsShipping" checked={sameAsShipping} onCheckedChange={(checked) => setSameAsShipping(checked as boolean)} />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billFirstName">First Name *</Label>
                          <Input id="billFirstName" name="billFirstName" required className="border-pink-200" />
                        </div>
                        <div>
                          <Label htmlFor="billLastName">Last Name *</Label>
                          <Input id="billLastName" name="billLastName" required className="border-pink-200" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="billAddress1">Address Line 1 *</Label>
                        <Input id="billAddress1" name="billAddress1" required className="border-pink-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billCity">City *</Label>
                          <Input id="billCity" name="billCity" required className="border-pink-200" />
                        </div>
                        <div>
                          <Label htmlFor="billProvince">Province *</Label>
                          <Select name="billProvince" required>
                            <SelectTrigger className="border-pink-200">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                              <SelectItem value="Gauteng">Gauteng</SelectItem>
                              <SelectItem value="Western Cape">Western Cape</SelectItem>
                              <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                              <SelectItem value="Free State">Free State</SelectItem>
                              <SelectItem value="Limpopo">Limpopo</SelectItem>
                              <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                              <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                              <SelectItem value="North West">North West</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billPostal">Postal Code *</Label>
                          <Input id="billPostal" name="billPostal" required className="border-pink-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                      4
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-pink-200 rounded-lg">
                      <RadioGroupItem value="payfast" id="payfast" />
                      <Label htmlFor="payfast" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">PayFast</p>
                            <p className="text-sm text-gray-600">Secure payment with card or EFT</p>
                          </div>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-pink-200 rounded-lg mt-2">
                      <RadioGroupItem value="eft" id="eft" />
                      <Label htmlFor="eft" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Direct EFT</p>
                          <p className="text-sm text-gray-600">Bank transfer (manual verification)</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-pink-100 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `R${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-pink-600">R{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-green-50 p-4 rounded-lg mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Secure Checkout</span>
                    </div>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• SSL encrypted payment</li>
                      <li>• 30-day return policy</li>
                      <li>• Handcrafted with love guarantee</li>
                    </ul>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Shipping Information</span>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• 5-7 business days crafting time</li>
                      <li>• 2-3 business days shipping</li>
                      <li>• Free shipping over R300</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-600 hover:bg-pink-700 mt-6" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Order - R${total.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
