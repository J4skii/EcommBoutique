"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { addToCart } from "@/app/actions/cart"
import { toast } from "sonner" // Assuming sonner is installed as per package.json

export interface Product {
  id: string
  name: string
  price: string
  imageUrl: string | null
  description: string | null
  stockQuantity: number
  // For variants, we might need more info, but for listing display:
  variants?: any[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    // If product has variants, we should probably go to details page
    if (product.variants && product.variants.length > 0) {
        // Redirect logic handled by Link wrapper usually, but here we want to force navigation?
        // Actually, if we are in a Link, we can't easily redirect programmatically without router.push
        // But better UX: change button text to "Select Options"
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

  const inStock = product.stockQuantity > 0

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
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
