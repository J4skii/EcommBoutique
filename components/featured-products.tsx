import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/commerce"

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  // Map products to ProductCard props
  const mappedProducts = products.map(p => ({
    ...p,
    price: p.price.toString(),
  }));

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
          {mappedProducts.length > 0 ? (
            mappedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No products found.</div>
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
