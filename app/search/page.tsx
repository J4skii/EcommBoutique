import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { SearchContent } from "./_search-content"

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search our full collection of handcrafted faux leather bows. Filter by price, availability, and style to find the perfect bow for you.",
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
