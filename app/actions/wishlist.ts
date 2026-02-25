"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { wishlists, wishlistItems } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(productId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Must be logged in to sync wishlist")
  }

  // Find or create wishlist
  let wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.userId, user.id)
  })

  if (!wishlist) {
    const [newWishlist] = await db.insert(wishlists).values({ userId: user.id }).returning()
    wishlist = newWishlist
  }

  // Check if item exists
  const existingItem = await db.query.wishlistItems.findFirst({
    where: and(
      eq(wishlistItems.wishlistId, wishlist.id),
      eq(wishlistItems.productId, productId)
    )
  })

  if (existingItem) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existingItem.id))
    return { added: false }
  } else {
    await db.insert(wishlistItems).values({
      wishlistId: wishlist.id,
      productId: productId
    })
    return { added: true }
  }
}

export async function getWishlist() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const wishlist = await db.query.wishlists.findFirst({
        where: eq(wishlists.userId, user.id),
        with: {
            items: {
                with: {
                    product: true
                }
            }
        }
    })

    return wishlist?.items.map(i => i.product) || []
}
