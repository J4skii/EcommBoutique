"use client"

import React, { useState, useRef } from "react"
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
import { createCheckoutSession } from "@/app/actions/checkout"
import { toast } from "sonner"

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image_url: string | null
}

export default function CheckoutClient({ initialCartItems }: { initialCartItems: CartItem[] }) {
  const [paymentMethod, setPaymentMethod] = useState("payfast")
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [payfastData, setPayfastData] = useState<any>(null)
  const [payfastUrl, setPayfastUrl] = useState<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  const subtotal = initialCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 300 ? 0 : 50 // Logic should match server action but for display
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    const formData = new FormData(e.currentTarget);

    try {
        const result = await createCheckoutSession(formData);

        if (result.success && result.payfastData) {
            setPayfastData(result.payfastData);
            setPayfastUrl(result.payfastUrl);

            // Allow state to update then submit the hidden form
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.submit();
                }
            }, 100);
        }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process order. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      {/* Hidden PayFast Form */}
      {payfastData && (
          <form ref={formRef} action={payfastUrl} method="POST" style={{ display: 'none' }}>
              {Object.entries(payfastData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value as string} />
              ))}
          </form>
      )}

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
                      <Input id="firstName" name="firstName" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required className="border-pink-200" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
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
                    <Label htmlFor="address">Address Line 1</Label>
                    <Input id="address" name="address" required className="border-pink-200" />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input id="address2" name="address2" className="border-pink-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required className="border-pink-200" />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select name="province">
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
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" required className="border-pink-200" />
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
                    <Checkbox id="sameAsShipping" checked={sameAsShipping} onCheckedChange={(checked) => setSameAsShipping(checked === true)} />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      {/* Billing fields would go here, need to update server action to handle them if needed */}
                      <p className="text-sm text-gray-500">Currently assuming same as shipping for demo purposes.</p>
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
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Sidebar */}
            <div>
              <Card className="border-pink-100 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {initialCartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                          ) : null}
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

                   <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 mt-6" disabled={isProcessing}>
                    {isProcessing ? "Redirecting to PayFast..." : `Pay Now - R${total.toFixed(2)}`}
                  </Button>

                  <div className="text-center text-xs text-gray-500 mt-4">
                      <p>You will be redirected to PayFast to complete your payment.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
