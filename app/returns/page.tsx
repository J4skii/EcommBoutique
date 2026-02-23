import { RotateCcw, Shield, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            <span className="font-semibold text-pink-600">Returns</span> & Exchanges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your satisfaction is our priority. We want you to love your Monica's bow!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-pink-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle className="text-lg">30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Return window for standard items</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Easy Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Simple return process via email</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Full refund for defective items</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Fast Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Refunds within 5-7 business days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle>Return Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Standard Items</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 30-day return window from delivery date</li>
                  <li>• Items must be in original condition</li>
                  <li>• Original packaging preferred</li>
                  <li>• Full refund minus return shipping</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Custom Orders</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Non-refundable unless defective</li>
                  <li>• Quality issues covered 100%</li>
                  <li>• Contact Monica within 7 days</li>
                  <li>• Photo evidence may be required</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Exchanges</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Size exchanges available</li>
                  <li>• Color exchanges subject to availability</li>
                  <li>• Customer pays shipping both ways</li>
                  <li>• Same item value only</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle>How to Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Contact Us</h4>
                    <p className="text-sm text-gray-600">
                      Email hello@monicasbows.co.za with your order number and reason for return
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Get Return Label</h4>
                    <p className="text-sm text-gray-600">We'll email you a return authorization and shipping label</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pack & Ship</h4>
                    <p className="text-sm text-gray-600">Package the item securely and drop off at PostNet</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Get Refund</h4>
                    <p className="text-sm text-gray-600">Refund processed within 5-7 business days of receipt</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Monica is here to help! Contact us for any questions about returns or exchanges.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="bg-pink-600 hover:bg-pink-700">
                    <Link href="/contact">Contact Monica</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="border-pink-200 text-pink-600 bg-transparent">
                    <Link href="mailto:hello@monicasbows.co.za">Email Us</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-pink-100 mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Can I return a custom bow?</h4>
                  <p className="text-sm text-gray-600">
                    Custom orders are generally non-refundable unless there's a quality issue or the bow doesn't match
                    the agreed specifications.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Who pays for return shipping?</h4>
                  <p className="text-sm text-gray-600">
                    Customer pays return shipping unless the item is defective or we made an error.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">How long do refunds take?</h4>
                  <p className="text-sm text-gray-600">
                    Refunds are processed within 5-7 business days after we receive the returned item.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Can I exchange for a different color?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, subject to availability. You'll need to pay shipping both ways for exchanges.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">What if my bow arrives damaged?</h4>
                  <p className="text-sm text-gray-600">
                    Contact us immediately with photos. We'll arrange a replacement or full refund at no cost to you.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Can I return after 30 days?</h4>
                  <p className="text-sm text-gray-600">
                    We may consider returns after 30 days on a case-by-case basis. Contact Monica to discuss your
                    situation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
