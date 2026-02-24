'use server';

import { db } from '@/lib/db';
import { orders, orderItems, cartItems, carts } from '@/lib/db/schema';
import { getCart } from '@/lib/cart';
import { payfast } from '@/lib/payfast';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createCheckoutSession(formData: FormData) {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const postalCode = formData.get('postalCode') as string;
  const phone = formData.get('phone') as string;

  if (!email || !firstName || !lastName || !address || !city || !postalCode) {
    throw new Error('Missing required fields');
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of cart.items) {
    const price = item.variant ?
        (Number(item.product.price) + Number(item.variant.priceAdjustment || 0)) :
        Number(item.product.price);
    subtotal += price * item.quantity;
  }

  const shippingCost = 100; // Flat rate for now, or calculate based on weight/location
  const taxAmount = 0; // Simplified
  const totalAmount = subtotal + shippingCost + taxAmount;

  // Create Order
  const [newOrder] = await db.insert(orders).values({
    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerEmail: email,
    customerName: `${firstName} ${lastName}`,
    shippingAddress: { address, city, postalCode, phone },
    billingAddress: { address, city, postalCode, phone }, // Assuming same for now
    subtotal: subtotal.toString(),
    shippingCost: shippingCost.toString(),
    taxAmount: taxAmount.toString(),
    totalAmount: totalAmount.toString(),
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  // Create Order Items
  for (const item of cart.items) {
    const price = item.variant ?
        (Number(item.product.price) + Number(item.variant.priceAdjustment || 0)) :
        Number(item.product.price);

    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantName: item.variant ? `${item.variant.color} / ${item.variant.size}` : null,
      quantity: item.quantity,
      unitPrice: price.toString(),
      totalPrice: (price * item.quantity).toString(),
    });
  }

  // Clear Cart
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

  // Generate PayFast Data
  const payfastData = payfast.createPaymentData({
    orderId: newOrder.id,
    customerName: `${firstName} ${lastName}`,
    customerEmail: email,
    customerPhone: phone,
    amount: totalAmount,
    description: `Order #${newOrder.orderNumber}`,
  });

  return {
    success: true,
    payfastData,
    payfastUrl: payfast.getPaymentUrl(),
  };
}
