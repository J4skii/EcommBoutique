"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  useEffect(() => {
    // PayFast returns the order number in the m_payment_id parameter
    const paymentId = searchParams.get("m_payment_id")
    if (paymentId) {
      setOrderNumber(paymentId)
      
      // Clear the cart after successful payment
      localStorage.removeItem("customer_id")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-pink-100">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-light text-gray-800 mb-4">
              Payment <span className="font-semibold text-pink-600">Successful!</span>
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your order! We've received your payment and Paiton is already preparing your beautiful bows.
            </p>

            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-semibold text-gray-800">{orderNumber}</p>
              </div>
            )}

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Confirmation Email</p>
                  <p className="text-sm text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">What's Next?</p>
                  <p className="text-sm text-gray-600">
                    Paiton will craft your order within 5-7 business days. You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 border-pink-200 text-pink-700 bg-transparent">
                <Link href="/orders">View My Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
