"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Upload, Palette, Clock, Star, CheckCircle } from "lucide-react"
import Image from "next/image"

const colorOptions = [
  { name: "Classic Black", value: "black" },
  { name: "Rose Pink", value: "rose" },
  { name: "Navy Blue", value: "navy" },
  { name: "Forest Green", value: "green" },
  { name: "Burgundy", value: "burgundy" },
  { name: "Cream", value: "cream" },
]

const sizeOptions = [
  { name: "Small (5cm)", value: "small", price: 35 },
  { name: "Medium (7cm)", value: "medium", price: 45 },
  { name: "Large (10cm)", value: "large", price: 55 },
  { name: "Extra Large (12cm)", value: "xl", price: 65 },
]

export default function CustomOrdersPage() {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState("medium")
  const [quantity, setQuantity] = useState(1)
  const [rushOrder, setRushOrder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form field state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")

  const basePrice = sizeOptions.find((s) => s.value === selectedSize)?.price || 45
  const totalPrice = basePrice * quantity + (rushOrder ? 50 : 0)

  const handleColorChange = (colorValue: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, colorValue])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== colorValue))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone || null,
          colors: selectedColors,
          size: selectedSize,
          quantity,
          special_requests: description || null,
          is_rush_order: rushOrder,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit order. Please try again.")
      }
    } catch (err) {
      setError("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-gray-800 mb-4">
            Request <span className="font-semibold text-pink-600">Submitted!</span>
          </h1>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Thank you! Paiton has received your custom order request and will contact you at{" "}
            <span className="font-medium">{email}</span> within 24 hours to discuss your design and confirm the details.
          </p>
          <div className="bg-pink-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Your Request Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Size:</span> {sizeOptions.find(s => s.value === selectedSize)?.name}</p>
              <p><span className="font-medium">Quantity:</span> {quantity}</p>
              {selectedColors.length > 0 && (
                <p><span className="font-medium">Colors:</span> {selectedColors.join(", ")}</p>
              )}
              {rushOrder && <p><span className="font-medium text-orange-600">Rush Order</span> (+R50)</p>}
              <p className="text-lg font-semibold text-pink-600 pt-2 border-t">Estimated: R{totalPrice}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-pink-200 text-pink-600 bg-transparent"
            onClick={() => {
              setSubmitted(false)
              setName("")
              setEmail("")
              setPhone("")
              setDescription("")
              setSelectedColors([])
              setSelectedSize("medium")
              setQuantity(1)
              setRushOrder(false)
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-pink-500 fill-current" />
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Custom Orders</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Design Your <span className="font-semibold text-pink-600">Perfect Bow</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Work directly with Paiton to create a one-of-a-kind bow that&apos;s perfectly tailored to your style and needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-600" />
                  Custom Bow Designer
                </CardTitle>
                <CardDescription>
                  Tell Paiton exactly what you&apos;re looking for and she&apos;ll bring your vision to life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
                  )}

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="border-pink-200 focus:border-pink-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="border-pink-200 focus:border-pink-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (WhatsApp preferred)</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 123 456 789"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  {/* Bow Specifications */}
                  <div>
                    <Label className="text-base font-semibold">Choose Your Colors</Label>
                    <p className="text-sm text-gray-600 mb-3">Select one or more colors for your custom bow</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {colorOptions.map((color) => (
                        <div key={color.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={color.value}
                            checked={selectedColors.includes(color.value)}
                            onCheckedChange={(checked) => handleColorChange(color.value, checked as boolean)}
                          />
                          <label htmlFor={color.value} className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm">{color.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Bow Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="border-pink-200">
                          <SelectValue placeholder="Choose size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.name} - R{size.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="20"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Special Requests &amp; Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your vision... any special details, occasions, or inspiration you&apos;d like Paiton to know about"
                      rows={4}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <Label>Inspiration Images (Optional)</Label>
                    <div className="border-2 border-dashed border-pink-200 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload images that inspire your design</p>
                      <p className="text-xs text-gray-400 mt-1">Feature coming soon — mention in description for now</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="rush" checked={rushOrder} onCheckedChange={(v) => setRushOrder(v === true)} />
                    <label htmlFor="rush" className="text-sm cursor-pointer">
                      Rush Order (+R50) — Need it within 3-5 days instead of 1-2 weeks
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Custom Order Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Process */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Price ({selectedSize})</span>
                    <span>R{basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>×{quantity}</span>
                  </div>
                  {rushOrder && (
                    <div className="flex justify-between text-orange-600">
                      <span>Rush Order</span>
                      <span>+R50</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Estimated Total</span>
                    <span className="text-pink-600">R{totalPrice}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Paiton will confirm the final price within 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Process Timeline */}
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-pink-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Submit Request", desc: "Tell Paiton about your dream bow" },
                    { step: "2", title: "Design Consultation", desc: "Paiton contacts you within 24 hours" },
                    { step: "3", title: "Handcrafting", desc: "1-2 weeks creation time" },
                    { step: "4", title: "Delivery", desc: "Your perfect bow arrives!" },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-3">
                      <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600 flex-shrink-0">
                        {step}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-gray-600">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Custom Orders */}
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-pink-600" />
                  Recent Custom Creations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Image
                      src="/placeholder.svg?height=50&width=50"
                      alt="Custom bow"
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">Wedding Set</p>
                      <p className="text-xs text-gray-600">Cream &amp; gold for bridal party</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Image
                      src="/placeholder.svg?height=50&width=50"
                      alt="Custom bow"
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">Corporate Colors</p>
                      <p className="text-xs text-gray-600">Navy &amp; silver for events</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
