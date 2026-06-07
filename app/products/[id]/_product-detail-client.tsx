"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Check,
  Loader2,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  stock_quantity: number
  colors: string[] | null
  sizes: string[] | null
  is_featured: boolean
  categories?: { name: string; slug: string } | null
  product_images?: { image_url: string; alt_text: string | null; sort_order: number }[]
}

const getCustomerId = () => {
  if (typeof window === "undefined") return null
  let id = localStorage.getItem("customer_id")
  if (!id) {
    id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("customer_id", id)
  }
  return id
}

export function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          setNotFound(true)
          return
        }
        const data = await response.json()
        const p = data.product
        setProduct(p)
        if (p.colors?.length) setSelectedColor(p.colors[0])
        if (p.sizes?.length) setSelectedSize(p.sizes[0])
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    const checkWishlist = async () => {
      const customerId = getCustomerId()
      if (!customerId) return
      try {
        const r = await fetch(`/api/wishlist?customerId=${customerId}`)
        if (r.ok) {
          const data = await r.json()
          setIsWishlisted(data.wishlistItems?.some((item: { product_id: string }) => item.product_id === id))
        }
      } catch {}
    }

    fetchProduct()
    checkWishlist()
  }, [id])

  const allImages = product
    ? [
        ...(product.image_url ? [{ image_url: product.image_url, alt_text: product.name }] : []),
        ...(product.product_images || []),
      ]
    : []

  const handleAddToCart = async () => {
    if (!product) return
    const customerId = getCustomerId()
    if (!customerId) return

    setIsAddingToCart(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          selected_color: selectedColor,
          selected_size: selectedSize,
          customer_id: customerId,
        }),
      })

      if (response.ok) {
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
        window.dispatchEvent(new Event("cart-updated"))
      } else {
        const err = await response.json()
        alert(err.error || "Failed to add to cart")
      }
    } catch {
      alert("Failed to add to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    const customerId = getCustomerId()
    if (!customerId) return

    setIsTogglingWishlist(true)
    try {
      if (isWishlisted) {
        const r = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id, customer_id: customerId }),
        })
        if (r.ok) {
          setIsWishlisted(false)
          window.dispatchEvent(new Event("wishlist-updated"))
        }
      } else {
        const r = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id, customer_id: customerId }),
        })
        if (r.ok) {
          setIsWishlisted(true)
          window.dispatchEvent(new Event("wishlist-updated"))
        }
      }
    } catch {}
    setIsTogglingWishlist(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500">This product doesn&apos;t exist or has been removed.</p>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    )
  }

  const inStock = product.stock_quantity > 0
  const maxQty = Math.min(product.stock_quantity, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-pink-600 transition-colors">Products</Link>
          {product.categories && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.categories.slug}`} className="hover:text-pink-600 transition-colors">
                {product.categories.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50 border border-pink-100">
              <Image
                src={allImages[activeImage]?.image_url || "/placeholder.svg?height=600&width=600"}
                alt={allImages[activeImage]?.alt_text || product.name}
                fill
                className="object-cover"
                priority
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-pink-600 text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Badge className="bg-white text-gray-800 text-lg px-6 py-2">Sold Out</Badge>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === index ? "border-pink-500" : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.categories && (
              <Link
                href={`/products?category=${product.categories.slug}`}
                className="text-pink-600 text-sm font-medium hover:underline"
              >
                {product.categories.name}
              </Link>
            )}

            <h1 className="text-3xl lg:text-4xl font-light text-gray-800 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-light text-gray-800">
                R<span className="font-medium">{product.price}</span>
              </span>
              {inStock ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {product.stock_quantity <= 5 ? `Only ${product.stock_quantity} left!` : "In Stock"}
                </Badge>
              ) : (
                <Badge variant="destructive">Sold Out</Badge>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Colour: <span className="font-normal text-gray-500">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-pink-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Size: <span className="font-normal text-gray-500">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-pink-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {inStock && (
              <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-50 text-gray-600"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-50 text-gray-600"
                  disabled={quantity >= maxQty}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className={`flex-1 py-6 text-lg rounded-xl transition-all ${
                  addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-pink-600 hover:bg-pink-700"
                }`}
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart || addedToCart}
              >
                {isAddingToCart ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Adding...</>
                ) : addedToCart ? (
                  <><Check className="h-5 w-5 mr-2" />Added to Cart!</>
                ) : (
                  <><ShoppingCart className="h-5 w-5 mr-2" />{inStock ? "Add to Cart" : "Sold Out"}</>
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`w-14 h-14 rounded-xl border-2 flex-shrink-0 ${
                  isWishlisted ? "bg-pink-50 border-pink-400" : "hover:bg-pink-50 hover:border-pink-300"
                }`}
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isTogglingWishlist ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
                ) : (
                  <Heart className={`h-5 w-5 ${isWishlisted ? "text-pink-500 fill-current" : "text-gray-400"}`} />
                )}
              </Button>
            </div>

            {addedToCart && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button className="flex-1 bg-gray-900 hover:bg-gray-800" asChild>
                  <Link href="/checkout">Checkout Now</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <Truck className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Free shipping over R300</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">30-day returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
