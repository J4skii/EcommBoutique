import { Truck, Package, Clock, MapPin, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            <span className="font-semibold text-pink-600">Shipping</span> Information
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver Paiton's beautiful handcrafted bows nationwide across South Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle>Free Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Enjoy free shipping on all orders over R300. Orders under R300 have a flat shipping rate of R50.
              </p>
            </CardContent>
          </Card>

          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Fast Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Standard items ship within 1-2 business days. Custom orders take 5-7 business days to handcraft.
              </p>
            </CardContent>
          </Card>

          <Card className="border-pink-100 text-center">
            <CardHeader>
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Secure Packaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Every bow is carefully packaged to ensure it arrives in perfect condition, ready to wear or gift.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-pink-600" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Nationwide Delivery</h4>
                  <p className="text-gray-600 mb-4">We deliver to all provinces in South Africa:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>• KwaZulu-Natal</div>
                    <div>• Gauteng</div>
                    <div>• Western Cape</div>
                    <div>• Eastern Cape</div>
                    <div>• Free State</div>
                    <div>• Limpopo</div>
                    <div>• Mpumalanga</div>
                    <div>• Northern Cape</div>
                    <div>• North West</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-pink-600" />
                Shipping Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800">Standard Shipping</h4>
                  <p className="text-sm text-gray-600">2-3 business days • R50 (Free over R300)</p>
                  <p className="text-xs text-gray-500 mt-1">Via PostNet or Aramex</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800">Express Shipping</h4>
                  <p className="text-sm text-gray-600">1-2 business days • R100</p>
                  <p className="text-xs text-gray-500 mt-1">Major cities only</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Local Pickup</h4>
                  <p className="text-sm text-gray-600">Durban area • Free</p>
                  <p className="text-xs text-gray-500 mt-1">Arrange via WhatsApp</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-pink-100 mt-8">
          <CardHeader>
            <CardTitle>Shipping Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Standard Items</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Placed</p>
                      <p className="text-xs text-gray-600">Confirmation email sent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Processing</p>
                      <p className="text-xs text-gray-600">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipped</p>
                      <p className="text-xs text-gray-600">Tracking number provided</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-semibold text-pink-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm">Delivered</p>
                      <p className="text-xs text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Custom Orders</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Design Consultation</p>
                      <p className="text-xs text-gray-600">Paiton contacts you within 24hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Handcrafting</p>
                      <p className="text-xs text-gray-600">5-7 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Quality Check</p>
                      <p className="text-xs text-gray-600">Final inspection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipped & Delivered</p>
                      <p className="text-xs text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
