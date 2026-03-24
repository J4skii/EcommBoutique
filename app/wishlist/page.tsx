"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Get customer ID from localStorage
const getCustomerId = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("customer_id")
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      const customerId = getCustomerId()
      
      // If not logged in, show empty wishlist
      if (!customerId) {
        setWishlistItems([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/wishlist?customer_id=${customerId}`)
        const data = await response.json()

        if (response.ok) {
          setWishlistItems(data.wishlistItems || [])
        } else {
          setError(data.error || "Failed to load wishlist")
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        setError("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  const removeFromWishlist = async (productId: string) => {
    const customerId = getCustomerId()
    if (!customerId) return

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId, product_id: productId })
      })

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.product_id !== productId))
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err)
    }
  }

  const addToCart = async (productId: string) => {
    const customerId = getCustomerId()
    if (!customerId) {
      alert("Please log in to add items to cart")
      return
    }

    setAddingToCart(productId)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          product_id: productId,
          quantity: 1
        })
      })

      if (response.ok) {
        alert("Added to cart!")
        // Optionally remove from wishlist after adding to cart
        await removeFromWishlist(productId)
      } else {
        alert("Failed to add to cart")
      }
    } catch (err) {
      console.error("Error adding to cart:", err)
      alert("Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-pink-600 hover:bg-pink-700">
            Try Again
          </Button>
        </div>
      </div>
    )
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
          {wishlistItems.map((item) => {
            // Handle both nested and flat product data structures
            const product = item.products || item
            const productId = item.product_id || item.id
            
            return (
              <Card key={item.id} className="group border-pink-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(productId)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart className="h-4 w-4 text-pink-500 fill-current" />
                    </button>
                    {product.stock_quantity === 0 && (
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
                      <div className="flex gap-1 mb-4">
                        {product.colors.slice(0, 4).map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200"
                            title={color}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-light text-gray-800">
                        R<span className="font-medium">{product.price}</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {product.stock_quantity > 0 ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-full"
                          onClick={() => addToCart(productId)}
                          disabled={addingToCart === productId}
                        >
                          {addingToCart === productId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </>
                          )}
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
                        onClick={() => removeFromWishlist(productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
