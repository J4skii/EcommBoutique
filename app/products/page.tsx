import { getProducts } from "@/lib/commerce"
import { ProductCard } from "@/components/product-card"

export const metadata = {
  title: "Shop All Bows",
  description: "Browse our complete collection of handcrafted faux leather bows.",
}

export default async function ProductsPage() {
  const products = await getProducts()

  const mappedProducts = products.map(p => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect bow for every occasion. Handcrafted with love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mappedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {mappedProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
