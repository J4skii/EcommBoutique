import { Heart, Award, Sparkles, MapPin, Clock, Users } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full h-96 lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl transform -rotate-3"></div>
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=500&width=600"
                    alt="Paiton in her Durban studio crafting beautiful bows"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-pink-100">
                  <Sparkles className="h-6 w-6 text-pink-500 fill-current" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-pink-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-medium text-gray-700">Durban, KZN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-0.5 bg-pink-400"></div>
                <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">About Paiton</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
                Crafting Beauty with
                <span className="font-semibold text-pink-600 block">Love & Tradition</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From my cozy studio in beautiful Durban, KwaZulu-Natal, I've been creating exquisite handmade
                accessories for over three decades. Each bow tells a story of craftsmanship, love, and the timeless art
                of handmaking that brings joy to women across South Africa.
              </p>
              <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
                <Link href="/products">Explore My Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6">
              My <span className="font-semibold text-pink-600">Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three decades of passion, creativity, and dedication to the art of bow making
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-8 items-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-600 font-bold text-lg">1990s</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">The Beginning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Started crafting bows as a hobby while raising my children in Durban. What began as a creative outlet
                  quickly became a passion when friends and family fell in love with my unique designs.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-lg">2000s</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Local Markets</h3>
                <p className="text-gray-600 leading-relaxed">
                  Began selling at local craft markets around KwaZulu-Natal. The response was overwhelming - customers
                  loved the quality and attention to detail that went into each handmade piece.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-lg">2010s</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Growing Recognition</h3>
                <p className="text-gray-600 leading-relaxed">
                  Word spread about Paiton's beautiful bows. Regular customers became friends, and custom orders started
                  pouring in for weddings, special events, and corporate functions.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-lg">2024</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Going Digital</h3>
                <p className="text-gray-600 leading-relaxed">
                  Launched Paitons Boutique online to share my passion with customers across South Africa. Every
                  bow is still handcrafted with the same love and attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6">
              What Makes Us <span className="font-semibold text-pink-600">Special</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Handcrafted with Love</h3>
              <p className="text-gray-600 leading-relaxed">
                Every bow is carefully crafted by hand, ensuring each piece is unique and made with genuine care and
                attention to detail.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Premium Materials</h3>
              <p className="text-gray-600 leading-relaxed">
                We use only the finest faux leather materials, chosen for their beauty, durability, and ethical sourcing
                from trusted suppliers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Timeless Elegance</h3>
              <p className="text-gray-600 leading-relaxed">
                Our designs blend classic sophistication with contemporary South African style, perfect for any
                occasion.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Personal Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Every customer is treated like family. We offer personalized consultations and custom designs to match
                your unique style.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">30+ Years Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Three decades of perfecting the craft means you're getting bows made with unmatched skill and expertise.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Proudly South African</h3>
              <p className="text-gray-600 leading-relaxed">
                Based in beautiful Durban, KZN, supporting local suppliers and celebrating South African craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6">
            Ready to Find Your <span className="font-semibold text-pink-600">Perfect Bow?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our collection of handcrafted bows or work with Paiton to create something uniquely yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-8 bg-transparent"
            >
              <Link href="/custom-orders">Custom Order</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
