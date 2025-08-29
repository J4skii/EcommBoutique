import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data - replace with actual database calls
const featuredProducts = [
  {
    id: "1",
    name: "Classic Rose Bow",
    price: 45,
    image: "/placeholder.svg?height=300&width=300",
    description: "Elegant rose-colored bow perfect for any occasion",
    inStock: true,
  },
  {
    id: "2",
    name: "Midnight Black Bow",
    price: 50,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sophisticated black bow for formal events",
    inStock: true,
  },
  {
    id: "3",
    name: "Sunshine Yellow Bow",
    price: 42,
    image: "/placeholder.svg?height=300&width=300",
    description: "Bright and cheerful yellow bow to brighten your day",
    inStock: false,
  },
  {
    id: "4",
    name: "Forest Green Bow",
    price: 48,
    image: "/placeholder.svg?height=300&width=300",
    description: "Natural green bow inspired by forest walks",
    inStock: true,
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Featured Collection</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6">
            Our Most <span className="font-semibold text-pink-600">Beloved Bows</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our customers' favorite handcrafted faux leather bows, each one made with decades of love and
            expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-8"
          >
            <Link href="/products">Explore Full Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
