import { getProduct } from "@/lib/commerce"
import { ProductDetail } from "@/components/product-detail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  // Ensure types match what ProductDetail expects (specifically dates to strings if any, though here we don't use dates in ProductDetail props yet)
  // Also price is string from Drizzle decimal

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProductDetail product={product as any} />
      </div>
    </div>
  )
}
