import { db } from '@/lib/db';
import { products, orders, orderItems } from '@/lib/db/schema';
import { desc, eq, count } from 'drizzle-orm';

export async function getAdminProducts() {
  return await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });
}

export async function getAdminOrders() {
  return await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
      customer: true,
    }
  });
}

export async function getAdminStats() {
    const productsCount = await db.select({ count: count() }).from(products);
    const ordersCount = await db.select({ count: count() }).from(orders);
    // Revenue calc would be good but for now just counts
    return {
        products: productsCount[0].count,
        orders: ordersCount[0].count,
    }
}
