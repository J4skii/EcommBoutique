import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { ProductsContent } from "./_products-content"

export const metadata: Metadata = {
  title: "Shop All Bows",
  description:
    "Browse Paitons Boutique's full collection of handcrafted faux leather bows. Shop by category, filter by price, and find the perfect piece for any occasion. Free shipping over R300.",
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
