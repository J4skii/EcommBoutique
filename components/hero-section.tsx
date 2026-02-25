import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-pink-500 fill-current" />
              <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Handcrafted Beauty</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6 leading-tight">
              Paiton's
              <span className="font-semibold text-pink-600 block">Bow Boutique</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-lg leading-relaxed">
              Exquisite handmade faux leather bows, crafted with decades of love and expertise. Each piece is unique,
              just like you.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.9/5 (127 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-500" />
                <span className="text-sm text-gray-600">500+ happy customers</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full">
                <Link href="/products">
                  Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-pink-200 text-pink-700 hover:bg-pink-50 px-8 py-3 rounded-full"
              >
                <Link href="#story">Paiton's Story</Link>
              </Button>
            </div>

            {/* Trending Badge */}
            <div className="mt-6 flex items-center justify-center lg:justify-start">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                🔥 Trending: Custom Bow Sets
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl transform rotate-3"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Paiton's beautiful handmade faux leather bows"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-pink-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Trusted by</p>
                <p className="text-xl font-semibold text-pink-600">500+ customers</p>
              </div>
              {/* Floating testimonial */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-pink-100 max-w-48">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-600">"Absolutely beautiful bows!"</p>
                <p className="text-xs text-gray-500">- Sarah M.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
