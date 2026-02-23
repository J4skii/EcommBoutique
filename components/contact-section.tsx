import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Get in Touch</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Let's <span className="font-semibold text-pink-600">Connect</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our bows or need a custom order? Monica would love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Monica</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-2xl">
                  <MapPin className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Visit us at local markets</p>
                  <p className="text-gray-600">Durban, KwaZulu-Natal</p>
                  <p className="text-sm text-gray-500">South Africa</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">+27 123 456 789</p>
                  <p className="text-gray-600">Mon-Fri 9AM-5PM SAST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">hello@monicasbows.co.za</p>
                  <p className="text-gray-600">We'll reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp Orders</p>
                  <p className="text-gray-600">+27 123 456 789</p>
                  <p className="text-sm text-gray-500">Quick orders & custom requests</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Market Schedule</p>
                  <p className="text-gray-600">Saturdays: Durban Craft Market</p>
                  <p className="text-gray-600">Sundays: Gateway Shopping Centre</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" className="border-pink-200 focus:border-pink-400 rounded-xl" />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="border-pink-200 focus:border-pink-400 rounded-xl"
                />
              </div>
              <Input placeholder="Subject" className="border-pink-200 focus:border-pink-400 rounded-xl" />
              <Textarea
                placeholder="Your Message"
                rows={4}
                className="border-pink-200 focus:border-pink-400 rounded-xl"
              />
              <Button className="w-full bg-pink-600 hover:bg-pink-700 rounded-xl py-3">Send Message to Monica</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
