import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Clock, MapPin, Package, AlertCircle } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Shipping Info</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Shipping <span className="font-semibold text-pink-600">Information</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about how we ship your beautiful handcrafted bows across South Africa.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-xl">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>
                Processing &amp; Production Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-600">
              <p>Each bow is <strong>handcrafted with love</strong> by Paiton after your order is placed. Please allow the following processing times:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  <span><strong>Standard items:</strong> 5-7 business days crafting time</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  <span><strong>Custom orders:</strong> 7-14 business days crafting time</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span><strong>Rush orders:</strong> 3-5 business days (+R50 surcharge)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                Shipping Rates &amp; Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-pink-100">
                      <th className="text-left py-3 pr-4 font-semibold text-gray-700">Option</th>
                      <th className="text-left py-3 pr-4 font-semibold text-gray-700">Cost</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Transit Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    <tr>
                      <td className="py-3 pr-4 text-gray-600">Standard Shipping</td>
                      <td className="py-3 pr-4 font-medium">R50</td>
                      <td className="py-3 text-gray-600">3-5 business days</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 text-gray-600">
                        Free Shipping
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Orders over R300</span>
                      </td>
                      <td className="py-3 pr-4 font-medium text-green-600">FREE</td>
                      <td className="py-3 text-gray-600">3-5 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-4">* Shipping times are estimates after crafting. We ship via PostNet and Aramex.</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-xl">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <p>We ship to <strong>all provinces</strong> in South Africa:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["KwaZulu-Natal", "Gauteng", "Western Cape", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "Northern Cape", "North West"].map((province) => (
                  <div key={province} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                    {province}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <p>Once your order ships, you will receive a tracking number via email. You can also view your order status on the <a href="/orders" className="text-pink-600 hover:underline">My Orders</a> page.</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Important Notes</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Please ensure your delivery address is correct before placing an order.</li>
                    <li>• Paitons Boutique is not responsible for courier delays.</li>
                    <li>• We do not ship internationally at this time.</li>
                    <li>• For urgent orders, WhatsApp us: +27 123 456 789</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
