"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, X } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
  stock_quantity: number
  colors: string[] | null
  sizes: string[] | null
  category?: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build URL with filters
      let url = "/api/products"
      const params = new URLSearchParams()
      
      if (selectedCategory) {
        params.append("category", selectedCategory)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchCategories, fetchProducts])

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        // Keep original order
        break
    }

    setFilteredProducts(result)
  }, [products, searchQuery, sortBy])

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      router.push(`/products?category=${slug}`)
    } else {
      router.push("/products")
    }
  }

  const getActiveCategoryName = () => {
    if (!selectedCategory) return null
    return categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">
              {selectedCategory ? getActiveCategoryName() : "Our Collection"}
            </span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Beautiful <span className="font-semibold text-pink-600">Handcrafted Bows</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {selectedCategory 
              ? `Browse our ${getActiveCategoryName()?.toLowerCase()} collection.`
              : "Discover our complete collection of exquisite faux leather bows, each one lovingly crafted to add elegance to your style."
            }
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(null)}
            className={selectedCategory === null ? "bg-pink-600" : "border-pink-200"}
          >
            All Products
          </Button>
          {categories.filter(c => c.is_active !== false).map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.slug)}
              className={selectedCategory === category.slug ? "bg-pink-600" : "border-pink-200"}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-12 border border-pink-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search our beautiful collection..."
                className="pl-12 border-pink-200 focus:border-pink-400 rounded-full bg-white/80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || selectedCategory) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("")
                  setSortBy("newest")
                  handleCategoryClick(null)
                }}
                className="text-pink-600"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-pink-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading beautiful bows...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} className="bg-pink-600 hover:bg-pink-700">
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">
                  {searchQuery 
                    ? "No products match your search." 
                    : selectedCategory
                    ? `No products in ${getActiveCategoryName()} yet.`
                    : "No products available yet."
                  }
                </p>
                {selectedCategory && (
                  <Button 
                    onClick={() => handleCategoryClick(null)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    View All Products
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
