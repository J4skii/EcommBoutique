import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-light text-pink-200 mb-4">404</h1>
          <h2 className="text-3xl font-light text-gray-800 mb-4">
            Page <span className="font-semibold text-pink-600">Not Found</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off like a beautiful bow in the wind.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 rounded-full px-8">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-8 bg-transparent"
          >
            <Link href="/products">
              <Search className="h-4 w-4 mr-2" />
              Browse Bows
            </Link>
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-pink-600 hover:underline">
              Contact Paiton
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
