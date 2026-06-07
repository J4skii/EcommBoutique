"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface WishlistItem {
  id: string
  product_id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
  stock_quantity: number
  colors: string[] | null
}

const getCustomerId = () => {
  if (typeof window === "undefined") return null
  let customerId = localStorage.getItem("customer_id")
  if (!customerId) {
    customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("customer_id", customerId)
  }
  return customerId
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [removingFromWishlist, setRemovingFromWishlist] = useState<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    const customerId = getCustomerId()
    if (!customerId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/wishlist?customerId=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        const items = (data.wishlistItems || data.data || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || "Product",
          price: item.products?.price || 0,
          image_url: item.products?.image_url || null,
          description: item.products?.description || null,
          stock_quantity: item.products?.stock_quantity || 0,
          colors: item.products?.colors || null,
        }))
        setWishlistItems(items)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const removeFromWishlist = async (itemId: string, productId: string) => {
    const customerId = getCustomerId()
    if (!customerId) return

    setRemovingFromWishlist(itemId)
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, customer_id: customerId }),
      })

      if (response.ok) {
        setWishlistItems((items) => items.filter((item) => item.id !== itemId))
        window.dispatchEvent(new Event("wishlist-updated"))
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    } finally {
      setRemovingFromWishlist(null)
    }
  }

  const addToCart = async (productId: string) => {
    const customerId = getCustomerId()
    if (!customerId) return

    setAddingToCart(productId)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
          customer_id: customerId,
        }),
      })

      if (response.ok) {
        window.dispatchEvent(new Event("cart-updated"))
        alert("Added to cart!")
      } else {
        const err = await response.json()
        alert(err.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
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
          <p className="text-gray-600 mb-8">Save your favourite bows to your wishlist and never lose track of them!</p>
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
                <Link href={`/products/${item.product_id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromWishlist(item.id, item.product_id)
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      disabled={removingFromWishlist === item.id}
                    >
                      {removingFromWishlist === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                      ) : (
                        <Heart className="h-4 w-4 text-pink-500 fill-current" />
                      )}
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
                </Link>

                <div className="p-5">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-medium text-gray-800 mb-2 text-lg hover:text-pink-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

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
                        disabled={addingToCart === item.product_id}
                      >
                        {addingToCart === item.product_id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-1" />
                        )}
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
                      onClick={() => removeFromWishlist(item.id, item.product_id)}
                      disabled={removingFromWishlist === item.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
