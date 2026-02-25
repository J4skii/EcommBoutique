"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Message sent successfully! Paiton will get back to you within 24 hours.")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Get in Touch</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Let's <span className="font-semibold text-pink-600">Connect</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our bows or need a custom order? Paiton would love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Contact Paiton</h2>

            <div className="space-y-6">
              <Card className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-100 p-3 rounded-2xl">
                      <MapPin className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Visit us at local markets</h3>
                      <p className="text-gray-600">Durban, KwaZulu-Natal</p>
                      <p className="text-sm text-gray-500">South Africa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-2xl">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">+27 123 456 789</h3>
                      <p className="text-gray-600">Mon-Fri 9AM-5PM SAST</p>
                      <p className="text-sm text-gray-500">Call or SMS anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">hello@paitonsboutique.co.za</h3>
                      <p className="text-gray-600">We'll reply within 24 hours</p>
                      <p className="text-sm text-gray-500">For general inquiries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-2xl">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">WhatsApp Orders</h3>
                      <p className="text-gray-600">+27 123 456 789</p>
                      <p className="text-sm text-gray-500">Quick orders & custom requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Market Schedule</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Saturdays: Durban Craft Market</p>
                        <p>Sundays: Gateway Shopping Centre</p>
                        <p className="text-sm text-gray-500">9AM - 4PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-pink-600" />
                  Send Paiton a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        className="border-pink-200 focus:border-pink-400 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        className="border-pink-200 focus:border-pink-400 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="border-pink-200 focus:border-pink-400 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="+27 123 456 789"
                      className="border-pink-200 focus:border-pink-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="border-pink-200 focus:border-pink-400 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell Paiton what you're looking for or ask any questions..."
                      rows={5}
                      className="border-pink-200 focus:border-pink-400 rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 rounded-xl py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message to Paiton"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-pink-100 mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">How long does it take to make a custom bow?</h4>
                  <p className="text-sm text-gray-600">
                    Custom orders typically take 1-2 weeks to complete, plus shipping time.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Do you ship nationwide?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! We ship to all provinces in South Africa via PostNet or Aramex.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Can I return a bow if I'm not happy?</h4>
                  <p className="text-sm text-gray-600">We offer a 30-day return policy for all standard items.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Do you offer bulk discounts?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, we offer special pricing for orders of 10+ bows. Contact us for a quote!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
