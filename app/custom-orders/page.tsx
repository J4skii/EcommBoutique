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
import { Sparkles, Upload, Palette, Clock, Star } from "lucide-react"
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
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [rushOrder, setRushOrder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Custom order request submitted successfully! Monica will contact you within 24 hours.")
    } catch (error) {
      alert("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            Work directly with Monica to create a one-of-a-kind bow that's perfectly tailored to your style and needs.
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
                  Tell Monica exactly what you're looking for and she'll bring your vision to life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="border-pink-200 focus:border-pink-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="border-pink-200 focus:border-pink-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (WhatsApp preferred)</Label>
                    <Input id="phone" placeholder="+27 123 456 789" className="border-pink-200 focus:border-pink-400" />
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
                            <div className="w-4 h-4 rounded-full bg-gray-300 border border-gray-300"></div>
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
                    <Label htmlFor="description">Special Requests & Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your vision... any special details, occasions, or inspiration you'd like Monica to know about"
                      rows={4}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <Label>Inspiration Images (Optional)</Label>
                    <div className="border-2 border-dashed border-pink-200 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload images that inspire your design</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2 border-pink-200 text-pink-600 bg-transparent"
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="rush" checked={rushOrder} onCheckedChange={setRushOrder} />
                    <label htmlFor="rush" className="text-sm cursor-pointer">
                      Rush Order (+R50) - Need it within 3-5 days instead of 1-2 weeks
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
                    <span>Base Price ({selectedSize || "medium"})</span>
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
                    <span>Total</span>
                    <span className="text-pink-600">R{totalPrice}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Monica will contact you within 24 hours to discuss your order
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
                  <div className="flex gap-3">
                    <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Submit Request</p>
                      <p className="text-xs text-gray-600">Tell Monica about your dream bow</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Design Consultation</p>
                      <p className="text-xs text-gray-600">Monica contacts you within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Handcrafting</p>
                      <p className="text-xs text-gray-600">1-2 weeks creation time</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-pink-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm">Delivery</p>
                      <p className="text-xs text-gray-600">Your perfect bow arrives!</p>
                    </div>
                  </div>
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
                      <p className="text-xs text-gray-600">Cream & gold for bridal party</p>
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
                      <p className="text-xs text-gray-600">Navy & silver for events</p>
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
