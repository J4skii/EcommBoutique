"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Added to cart:", product.name)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = () => {
    setIsLiked(!isLiked)
    console.log(isLiked ? "Removed from wishlist:" : "Added to wishlist:", product.name)
  }

  const inStock = product.stock_quantity > 0

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "text-pink-500 fill-current" : "text-gray-400"}`} />
        </button>
        {!inStock && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">Sold Out</Badge>
          </div>
        )}
        {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-500 text-white">Only {product.stock_quantity} left!</Badge>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-medium text-gray-800 mb-2 text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <div key={index} className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200" title={color} />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-light text-gray-800">
            R<span className="font-medium">{product.price}</span>
          </span>

          {inStock ? (
            <Button
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          ) : (
            <Button size="sm" disabled variant="outline" className="rounded-full px-4 bg-transparent">
              Sold Out
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
