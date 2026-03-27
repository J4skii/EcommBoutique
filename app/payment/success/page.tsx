"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Package, Mail, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface OrderStatus {
  order_number: string
  status: string
  payment_status: string
  payment_method: string | null
  total_amount: number
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [eftDetails, setEftDetails] = useState<any>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      const orderParam = searchParams.get("order")
      const sessionId = searchParams.get("session_id")

      // Resolve order number: URL param takes priority over localStorage
      let resolvedOrderNumber: string | null = orderParam ?? null

      const lastOrder = localStorage.getItem("lastOrder")
      const lastPaymentMethod = localStorage.getItem("lastPaymentMethod")
      const lastEftDetails = localStorage.getItem("lastEftDetails")

      if (!resolvedOrderNumber && lastOrder) {
        try {
          const parsed = JSON.parse(lastOrder)
          resolvedOrderNumber = parsed.order_number ?? null
        } catch (e) {
          console.error("Error parsing lastOrder from localStorage:", e)
        }
      }

      if (lastPaymentMethod) {
        setPaymentMethod(lastPaymentMethod)
      }

      if (lastEftDetails) {
        try {
          setEftDetails(JSON.parse(lastEftDetails))
        } catch (e) {
          console.error("Error parsing lastEftDetails from localStorage:", e)
        }
      }

      // Legacy: verify Stripe session
      if (sessionId) {
        try {
          const response = await fetch(`/api/payment/verify?session_id=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.order_number) {
              resolvedOrderNumber = data.order_number
            }
          }
        } catch (error) {
          console.error("Error verifying payment session:", error)
        }
      }

      setOrderNumber(resolvedOrderNumber)

      // Fetch real order status from the database
      if (resolvedOrderNumber) {
        try {
          const res = await fetch(
            `/api/orders/by-number?order_number=${encodeURIComponent(resolvedOrderNumber)}`
          )
          if (res.ok) {
            const json = await res.json()
            setOrderStatus(json.order ?? null)
            // Sync payment method from DB if not already set from localStorage
            if (!lastPaymentMethod && json.order?.payment_method) {
              setPaymentMethod(json.order.payment_method)
            }
          }
        } catch (error) {
          console.error("Error fetching order status:", error)
        }
      }

      setLoading(false)
    }

    loadOrder()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  const isPaid = orderStatus?.payment_status === "paid"
  const isFailed = orderStatus?.payment_status === "failed"
  const isEft = paymentMethod === "eft"

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-pink-100">
          <CardContent className="p-8 text-center">
            {isFailed ? (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-light text-gray-800 mb-4">
                  Payment <span className="font-semibold text-red-600">Failed</span>
                </h1>
                <p className="text-gray-600 mb-6">
                  Your payment could not be processed. Please try again or contact us for assistance.
                </p>
              </>
            ) : isPaid ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-light text-gray-800 mb-4">
                  Payment <span className="font-semibold text-pink-600">Successful!</span>
                </h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your order! We've received your payment and Paiton is already preparing your beautiful bows.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-light text-gray-800 mb-4">
                  Order <span className="font-semibold text-pink-600">Received</span>
                </h1>
                <p className="text-gray-600 mb-6">
                  {isEft
                    ? "Thank you! Your order has been placed. Please complete the bank transfer below to confirm your order."
                    : "Thank you for your order! Your payment is pending confirmation. We'll email you once it's confirmed."}
                </p>
              </>
            )}

            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-semibold text-gray-800">{orderNumber}</p>
              </div>
            )}

            {/* EFT Payment Details */}
            {isEft && eftDetails && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-yellow-800 mb-4">Bank Transfer Details</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Please make payment to the following account and email proof to info@monicasbowboutique.co.za:
                </p>
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="py-1 text-gray-600">Bank:</td><td className="py-1 font-medium">{eftDetails.bankName}</td></tr>
                    <tr><td className="py-1 text-gray-600">Account Number:</td><td className="py-1 font-medium">{eftDetails.accountNumber}</td></tr>
                    <tr><td className="py-1 text-gray-600">Account Type:</td><td className="py-1 font-medium">{eftDetails.accountType}</td></tr>
                    <tr><td className="py-1 text-gray-600">Branch Code:</td><td className="py-1 font-medium">{eftDetails.branchCode}</td></tr>
                    <tr><td className="py-1 text-gray-600">Account Holder:</td><td className="py-1 font-medium">{eftDetails.accountHolder}</td></tr>
                  </tbody>
                </table>
                <p className="text-sm text-yellow-700 mt-4">
                  Reference: <span className="font-mono font-bold">{orderNumber}</span>
                </p>
              </div>
            )}

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    {isPaid
                      ? "A confirmation email has been sent with your order details."
                      : "You'll receive an email confirmation once your payment is verified."}
                  </p>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
