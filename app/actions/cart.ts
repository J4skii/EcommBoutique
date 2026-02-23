'use server';

import { db } from '@/lib/db';
import { cartItems, carts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCart, createCart } from '@/lib/cart';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string, variantId?: string, quantity: number = 1) {
  let cart = await getCart();
  if (!cart) {
    cart = await createCart();
  }

  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId),
      variantId ? eq(cartItems.variantId, variantId) : undefined
    ),
  });

  if (existingItem) {
    await db.update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId: productId,
      variantId: variantId,
      quantity: quantity,
    });
  }

  revalidatePath('/cart');
}

export async function removeFromCart(itemId: string) {
  const cart = await getCart();
  if (!cart) return;

  await db.delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)));

  revalidatePath('/cart');
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const cart = await getCart();
  if (!cart) return;

  if (quantity === 0) {
    await removeFromCart(itemId);
    return;
  }

  await db.update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)));

  revalidatePath('/cart');
}
