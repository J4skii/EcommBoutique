"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { addToCart } from "@/app/actions/cart"
import { toggleWishlist } from "@/app/actions/wishlist"
import { toast } from "sonner"

export interface Product {
  id: string
  name: string
  price: string
  imageUrl: string | null
  description: string | null
  stockQuantity: number
  variants?: any[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisting, setIsWishlisting] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0) {
        return;
    }

    setIsAddingToCart(true)
    try {
      await addToCart(product.id, undefined, 1);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsWishlisting(true)
      try {
          const result = await toggleWishlist(product.id)
          toast.success(result.added ? "Added to wishlist" : "Removed from wishlist")
      } catch (e: any) {
          if (e.message.includes("Must be logged in")) {
              toast.error("Please log in to save items")
          } else {
              toast.error("Failed to update wishlist")
          }
      } finally {
          setIsWishlisting(false)
      }
  }

  const inStock = product.stockQuantity > 0
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col relative">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}

          <button
            onClick={handleToggleWishlist}
            disabled={isWishlisting}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-pink-500 transition-colors" />
          </button>

          {!inStock && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">Sold Out</Badge>
            </div>
          )}
          {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-orange-500 text-white">Only {product.stockQuantity} left!</Badge>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-800 mb-2 text-lg">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">{product.description}</p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-light text-gray-800">
              R<span className="font-medium">{product.price}</span>
            </span>

            {inStock ? (
               hasVariants ? (
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full px-4"
                >
                    Select Options
                </Button>
               ) : (
                <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
               )
            ) : (
              <Button size="sm" disabled variant="outline" className="rounded-full px-4 bg-transparent">
                Sold Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
