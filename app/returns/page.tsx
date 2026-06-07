import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, CheckCircle, XCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Returns Policy</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Returns &amp; <span className="font-semibold text-pink-600">Exchanges</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We want you to love your purchase. If you&apos;re not completely satisfied, here&apos;s how we can help.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-green-100 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-gray-800 text-lg">30-Day Return Policy</h3>
              </div>
              <p className="text-gray-600">
                We offer a <strong>30-day return policy</strong> on all standard items from the delivery date.
              </p>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-pink-600" />
                </div>
                Items Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Standard items in original, unworn condition with original packaging",
                  "Items returned within 30 days of delivery",
                  "Items that arrived damaged or defective (photos required)",
                  "Incorrect items received",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Custom orders (personalised or made-to-order items)",
                  "Items that have been worn, used, or damaged by the customer",
                  "Items returned after the 30-day window",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                </div>
                How to Return an Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-gray-600">
                {[
                  { step: "1", title: "Contact us first", desc: "Email hello@paitonsboutique.co.za with your order number and reason for return." },
                  { step: "2", title: "Receive return authorisation", desc: "Paiton will confirm your return and provide instructions. Do not send items without authorisation." },
                  { step: "3", title: "Package and ship", desc: "Pack the item securely in its original packaging. Return shipping is the customer's responsibility unless the item was defective." },
                  { step: "4", title: "Refund processed", desc: "Once received and inspected, your refund will be processed within 5-7 business days to your original payment method." },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-3">
                    <span className="bg-pink-100 text-pink-600 font-semibold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">{step}</span>
                    <div>
                      <p className="font-medium text-gray-800">{title}</p>
                      <p className="text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardContent className="p-6 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Need Help?</h3>
                <p className="text-gray-600 text-sm">Contact Paiton directly for any return or exchange questions.</p>
              </div>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
