import { NextRequest, NextResponse } from 'next/server';
import { payfast } from '@/lib/payfast';
import { db } from '@/lib/db';
import { orders, products, productVariants, orderItems } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const data: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    const signature = data.signature;
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const isValid = payfast.validateSignature(data, signature);

    if (!isValid) {
        console.error("Invalid PayFast signature");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const orderId = data.m_payment_id;
    const paymentStatus = data.payment_status;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    if (paymentStatus === 'COMPLETE') {
      // Update order status
      await db.update(orders)
        .set({
            paymentStatus: 'paid',
            status: 'processing',
            updatedAt: new Date()
        })
        .where(eq(orders.id, orderId));

      // Decrement stock
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
            items: true
        }
      });

      if (order) {
          for (const item of order.items) {
              if (item.variantId) {
                  await db.update(productVariants)
                      .set({ stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}` })
                      .where(eq(productVariants.id, item.variantId));
              } else if (item.productId) {
                  await db.update(products)
                      .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
                      .where(eq(products.id, item.productId));
              }
          }
      }
    } else if (paymentStatus === 'FAILED') {
        await db.update(orders)
        .set({
            paymentStatus: 'failed',
            status: 'cancelled',
            updatedAt: new Date()
        })
        .where(eq(orders.id, orderId));
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
