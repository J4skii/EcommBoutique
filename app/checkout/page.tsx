"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const cartItems = [
  {
    id: "1",
    name: "Classic Rose Bow",
    price: 45,
    quantity: 2,
    image_url: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    name: "Forest Green Bow",
    price: 48,
    quantity: 1,
    image_url: "/placeholder.svg?height=60&width=60",
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("payfast")
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 300 ? 0 : 50
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Redirect to payment or success page
      alert("Order placed successfully! Redirecting to payment...")
    } catch (error) {
      alert("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
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
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required className="border-pink-200" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+27 123 456 789" required className="border-pink-200" />
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
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input id="address1" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input id="address2" className="border-pink-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select>
                        <SelectTrigger className="border-pink-200">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kzn">KwaZulu-Natal</SelectItem>
                          <SelectItem value="gauteng">Gauteng</SelectItem>
                          <SelectItem value="western-cape">Western Cape</SelectItem>
                          <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                          <SelectItem value="free-state">Free State</SelectItem>
                          <SelectItem value="limpopo">Limpopo</SelectItem>
                          <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="northern-cape">Northern Cape</SelectItem>
                          <SelectItem value="north-west">North West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input id="postal" required className="border-pink-200" />
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
                    <Checkbox id="sameAsShipping" checked={sameAsShipping} onCheckedChange={setSameAsShipping} />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="billAddress1">Address Line 1</Label>
                        <Input id="billAddress1" required className="border-pink-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billCity">City</Label>
                          <Input id="billCity" required className="border-pink-200" />
                        </div>
                        <div>
                          <Label htmlFor="billProvince">Province</Label>
                          <Select>
                            <SelectTrigger className="border-pink-200">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kzn">KwaZulu-Natal</SelectItem>
                              <SelectItem value="gauteng">Gauteng</SelectItem>
                              <SelectItem value="western-cape">Western Cape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billPostal">Postal Code</Label>
                          <Input id="billPostal" required className="border-pink-200" />
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

                    <div className="flex items-center space-x-2 p-4 border border-pink-200 rounded-lg">
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

                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 mt-6" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Complete Order - R${total.toFixed(2)}`}
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
