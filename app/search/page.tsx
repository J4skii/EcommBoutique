import { searchProducts } from "@/lib/commerce"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Search Results",
  description: "Search results for Monica's Bow Boutique.",
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams
  const query = q || ""

  const products = query ? await searchProducts(query) : []

  const mappedProducts = products.map(p => ({
    ...p,
    price: p.price.toString(),
  }));

  async function searchAction(formData: FormData) {
      "use server"
      const searchQuery = formData.get("q") as string
      if (searchQuery) {
          redirect(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Search</h1>
          <form action={searchAction} className="max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input name="q" placeholder="Search for bows..." defaultValue={query} className="pl-10" />
              </div>
              <Button type="submit">Search</Button>
          </form>
        </div>

        {query && (
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700">Results for "{query}"</h2>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mappedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {mappedProducts.length === 0 && query && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
