import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { ProductDetailClient } from "./_product-detail-client"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const { data: product } = await supabase
      .from("products")
      .select("name, description, price, image_url")
      .eq("id", id)
      .single()

    if (!product) {
      return {
        title: "Product Not Found",
        description: "This product could not be found.",
      }
    }

    return {
      title: product.name,
      description:
        product.description ||
        `Shop ${product.name} for R${product.price} at Paitons Boutique — handcrafted faux leather bows made with love.`,
      openGraph: {
        title: `${product.name} | Paitons Boutique`,
        description:
          product.description ||
          `Shop ${product.name} for R${product.price} at Paitons Boutique.`,
        images: product.image_url ? [{ url: product.image_url }] : [],
      },
    }
  } catch {
    return {
      title: "Product",
      description: "Handcrafted faux leather bows by Paitons Boutique.",
    }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
        </div>
      }
    >
      <ProductDetailClient id={id} />
    </Suspense>
  )
}
