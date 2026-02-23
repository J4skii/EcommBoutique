import { Sparkles, Facebook, Instagram, Mail, MapPin, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-pink-50 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Monica's Bow Boutique</h3>
                <p className="text-sm text-pink-600 font-medium">Handcrafted with Love in Durban</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Creating beautiful handmade faux leather bows from our studio in Durban, KwaZulu-Natal for over 30 years.
              Each piece is crafted with love, care, and attention to detail that makes every bow truly special.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@monicasbows.co.za"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-gray-800">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/custom-orders" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors">
                  About Monica
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-6 text-gray-800">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span>Durban, KwaZulu-Natal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-pink-500" />
                <span>+27 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-500" />
                <span>hello@monicasbows.co.za</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              &copy; 2024 Monica's Bow Boutique. Made with 💖 in Durban, KZN, South Africa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
