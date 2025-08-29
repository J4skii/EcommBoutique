import { Heart, Award, Sparkles, MapPin } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="story" className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full h-96 lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl transform -rotate-3"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Monica crafting beautiful bows in her Durban studio"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-pink-100">
                <Sparkles className="h-6 w-6 text-pink-500 fill-current" />
              </div>
              {/* Location badge */}
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
              <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Monica's Story</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6">
              Crafted with
              <span className="font-semibold text-pink-600"> Love & Tradition</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From my studio in beautiful Durban, KwaZulu-Natal, I've been creating exquisite accessories for over three
              decades. Each bow tells a story of craftsmanship, love, and the timeless art of handmaking that brings joy
              to women across South Africa.
            </p>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Handcrafted with Love</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every bow is carefully crafted by hand in my Durban studio, ensuring each piece is unique and made
                    with genuine care.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Premium Materials</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use only the finest faux leather materials, chosen for their beauty, durability, and ethical
                    sourcing from trusted South African suppliers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Timeless Elegance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our designs blend classic sophistication with contemporary South African style, perfect for any
                    occasion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
