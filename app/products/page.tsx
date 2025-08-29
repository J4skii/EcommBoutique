import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

// Mock data - replace with actual database calls
const allProducts = [
  {
    id: "1",
    name: "Classic Rose Bow",
    price: 45,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Elegant rose-colored bow perfect for any occasion",
    stock_quantity: 8,
    colors: ["rose", "pink"],
    sizes: ["medium", "large"],
  },
  {
    id: "2",
    name: "Midnight Black Bow",
    price: 50,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Sophisticated black bow for formal events",
    stock_quantity: 5,
    colors: ["black"],
    sizes: ["small", "medium", "large"],
  },
  {
    id: "3",
    name: "Sunshine Yellow Bow",
    price: 42,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Bright and cheerful yellow bow to brighten your day",
    stock_quantity: 0,
    colors: ["yellow", "gold"],
    sizes: ["medium"],
  },
  {
    id: "4",
    name: "Forest Green Bow",
    price: 48,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Natural green bow inspired by forest walks",
    stock_quantity: 6,
    colors: ["green", "forest"],
    sizes: ["medium", "large"],
  },
  {
    id: "5",
    name: "Royal Purple Bow",
    price: 52,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Luxurious purple bow for special occasions",
    stock_quantity: 4,
    colors: ["purple", "royal"],
    sizes: ["large", "xl"],
  },
  {
    id: "6",
    name: "Ocean Blue Bow",
    price: 46,
    image_url: "/placeholder.svg?height=300&width=300",
    description: "Calming blue bow reminiscent of ocean waves",
    stock_quantity: 7,
    colors: ["blue", "navy"],
    sizes: ["small", "medium"],
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Our Collection</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Beautiful <span className="font-semibold text-pink-600">Handcrafted Bows</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our complete collection of exquisite faux leather bows, each one lovingly crafted to add elegance
            to your style.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-12 border border-pink-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search our beautiful collection..."
                className="pl-12 border-pink-200 focus:border-pink-400 rounded-full bg-white/80"
              />
            </div>

            <div className="w-full lg:w-48">
              <Select>
                <SelectTrigger className="border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <Select>
                <SelectTrigger className="border-pink-200 rounded-full bg-white/80">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-8 bg-transparent"
          >
            Load More Beautiful Bows
          </Button>
        </div>
      </div>
    </div>
  )
}
