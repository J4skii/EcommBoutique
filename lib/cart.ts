import { db } from './db';
import { carts, cartItems, products, productVariants } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export type CartItem = typeof cartItems.$inferSelect & {
  product: typeof products.$inferSelect;
  variant?: typeof productVariants.$inferSelect | null;
};

export type Cart = typeof carts.$inferSelect & {
  items: CartItem[];
};

export async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    return null;
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        with: {
          product: true,
          variant: true,
        },
        orderBy: (items, { desc }) => [desc(items.createdAt)],
      },
    },
  });

  return cart || null;
}

export async function createCart(): Promise<Cart> {
  const [newCart] = await db.insert(carts).values({}).returning();

  const cookieStore = await cookies();
  cookieStore.set('cartId', newCart.id, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    // Secure in production, but we don't know the exact env here, usually handled by frameworks
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return {
    ...newCart,
    items: [],
  };
}
