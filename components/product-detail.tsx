"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Minus, Plus, Check } from "lucide-react"
import Image from "next/image"
import { addToCart } from "@/app/actions/cart"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductVariant {
  id: string
  size: string | null
  color: string | null
  stockQuantity: number
  priceAdjustment: string | null
}

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  imageUrls: string[] | null
  stockQuantity: number
  variants: ProductVariant[]
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product.imageUrl)

  const hasVariants = product.variants && product.variants.length > 0

  // Derive available options
  const colors = hasVariants ? Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[] : []
  const sizes = hasVariants ? Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[] : []

  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length > 0 ? colors[0] : null)
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length > 0 ? sizes[0] : null)

  // Find selected variant based on color/size
  const selectedVariant = hasVariants
    ? product.variants.find(v =>
        (selectedColor ? v.color === selectedColor : true) &&
        (selectedSize ? v.size === selectedSize : true)
      )
    : null;

  // Update effect if needed, or just derive
  // If we change color, we might need to reset size if that size isn't available in that color?
  // For simplicity, let's assume all combos exist or just pick first available.

  const currentPrice = selectedVariant
    ? (parseFloat(product.price) + parseFloat(selectedVariant.priceAdjustment || "0")).toFixed(2)
    : product.price

  const maxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity
  const isOutOfStock = maxStock === 0

  const handleAddToCart = async () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select options")
      return
    }

    setIsAdding(true)
    try {
      await addToCart(product.id, selectedVariant?.id, quantity)
      toast.success("Added to cart")
    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image Gallery */}
        <div className="p-6 md:p-12 bg-gray-50 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-6">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </div>

          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 w-full max-w-md">
              {[product.imageUrl, ...(product.imageUrls || [])].filter(Boolean).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    selectedImage === url ? "border-pink-500 ring-2 ring-pink-100" : "border-transparent hover:border-gray-200"
                  )}
                >
                  <Image src={url!} alt={`View ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-light text-gray-900">
                R<span className="font-semibold">{currentPrice}</span>
              </span>
              {isOutOfStock ? (
                <Badge variant="destructive" className="px-3 py-1">Sold Out</Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
                  In Stock
                </Badge>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          {hasVariants && (
            <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-6">
              {colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm transition-all",
                          selectedColor === color
                            ? "border-pink-500 bg-pink-50 text-pink-700 font-medium"
                            : "border-gray-200 text-gray-600 hover:border-pink-200"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm transition-all",
                          selectedSize === size
                            ? "border-pink-500 bg-pink-50 text-pink-700 font-medium"
                            : "border-gray-200 text-gray-600 hover:border-pink-200"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-gray-200 rounded-full w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                disabled={quantity >= maxStock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-base shadow-lg shadow-pink-200"
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock || (hasVariants && !selectedVariant)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAdding ? "Adding to Cart..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>

            <Button size="icon" variant="outline" className="h-12 w-12 rounded-full border-gray-200 text-gray-400 hover:text-pink-500 hover:border-pink-200">
               <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
