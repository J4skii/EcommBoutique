"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

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

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=4")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 text-pink-600 animate-spin" />
          </div>
        </div>
      </section>
    )
  }

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

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products yet. Check out our full collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

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
