"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock wishlist data
const initialWishlistItems = [
  {
    id: "1",
    product_id: "1",
    name: "Classic Rose Bow",
    price: 45,
    image_url: "/placeholder.svg?height=200&width=200",
    description: "Elegant rose-colored bow perfect for any occasion",
    stock_quantity: 8,
    colors: ["rose", "pink"],
  },
  {
    id: "2",
    product_id: "5",
    name: "Royal Purple Bow",
    price: 52,
    image_url: "/placeholder.svg?height=200&width=200",
    description: "Luxurious purple bow for special occasions",
    stock_quantity: 4,
    colors: ["purple", "royal"],
  },
  {
    id: "3",
    product_id: "3",
    name: "Sunshine Yellow Bow",
    price: 42,
    image_url: "/placeholder.svg?height=200&width=200",
    description: "Bright and cheerful yellow bow to brighten your day",
    stock_quantity: 0,
    colors: ["yellow", "gold"],
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)

  const removeFromWishlist = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
  }

  const addToCart = async (productId: string) => {
    // Simulate adding to cart
    console.log("Adding to cart:", productId)
    alert("Added to cart!")
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-gray-800 mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8">Save your favorite bows to your wishlist and never lose track of them!</p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Discover Beautiful Bows
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 text-pink-600 hover:text-pink-700">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800">
            Your <span className="font-semibold text-pink-600">Wishlist</span>
          </h1>
          <p className="text-gray-600 mt-2">{wishlistItems.length} items saved for later</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group border-pink-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className="h-4 w-4 text-pink-500 fill-current" />
                  </button>
                  {item.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">Sold Out</Badge>
                    </div>
                  )}
                  {item.stock_quantity <= 3 && item.stock_quantity > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white">Only {item.stock_quantity} left!</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-medium text-gray-800 mb-2 text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                  {/* Colors */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex gap-1 mb-4">
                      {item.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200"
                          title={color}
                        />
                      ))}
                      {item.colors.length > 4 && (
                        <span className="text-xs text-gray-500 ml-1">+{item.colors.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-light text-gray-800">
                      R<span className="font-medium">{item.price}</span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {item.stock_quantity > 0 ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-full"
                        onClick={() => addToCart(item.product_id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    ) : (
                      <Button size="sm" disabled variant="outline" className="flex-1 rounded-full bg-transparent">
                        Sold Out
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full bg-transparent"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-8 bg-transparent"
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
