"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, CreditCard, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-pink-100">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
            
            <h1 className="text-3xl font-light text-gray-800 mb-4">
              Payment <span className="font-semibold text-orange-600">Cancelled</span>
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. Don't worry - your cart items are still saved and you can try again whenever you're ready.
            </p>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Try Again</p>
                  <p className="text-sm text-gray-600">You can return to checkout and try a different payment method.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Need Help?</p>
                  <p className="text-sm text-gray-600">
                    If you're having trouble with payment, please contact us and we'll be happy to assist.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
                <Link href="/cart">Return to Cart</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 border-pink-200 text-pink-700 bg-transparent">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
