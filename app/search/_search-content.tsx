"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Loader2 } from "lucide-react"

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

export function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [availability, setAvailability] = useState("all")

  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const url = query
        ? `/api/products?search=${encodeURIComponent(query)}`
        : "/api/products"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setAllProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get("q") || ""
    setSearchQuery(q)
    fetchProducts(q)
  }, [searchParams, fetchProducts])

  useEffect(() => {
    let filtered = [...allProducts]

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((p) => p.price >= min && (max ? p.price <= max : true))
    }

    if (availability === "in-stock") {
      filtered = filtered.filter((p) => p.stock_quantity > 0)
    } else if (availability === "sold-out") {
      filtered = filtered.filter((p) => p.stock_quantity === 0)
    }

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price)
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredProducts(filtered)
  }, [allProducts, searchQuery, sortBy, priceRange, availability])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSortBy("relevance")
    setPriceRange("all")
    setAvailability("all")
    router.push("/search")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Search <span className="font-semibold text-pink-600">Results</span>
          </h1>
          {searchQuery && !loading && (
            <p className="text-gray-600">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-8 border border-pink-100">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search beautiful bows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 border-pink-200 focus:border-pink-400 rounded-full bg-white/80"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-44 border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-40">Under R40</SelectItem>
                  <SelectItem value="40-50">R40 - R50</SelectItem>
                  <SelectItem value="50-60">R50 - R60</SelectItem>
                  <SelectItem value="60-999">Over R60</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-44 border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          {(searchQuery || sortBy !== "relevance" || priceRange !== "all" || availability !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-pink-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No bows match "${searchQuery}". Try a different search.`
                : "Try searching for a bow style, colour, or occasion."}
            </p>
            <Button onClick={clearFilters} className="bg-pink-600 hover:bg-pink-700 rounded-full">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
