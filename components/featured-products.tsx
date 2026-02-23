import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/database"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
  stock_quantity: number
  colors: string[] | null
  sizes: string[] | null
}

async function getFeaturedProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(4)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return products as Product[]
}

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts()
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
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Check back soon for our featured bows!</p>
            </div>
          )}
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
