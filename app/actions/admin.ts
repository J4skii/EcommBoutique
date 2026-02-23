'use server';

import { db } from '@/lib/db';
import { products, productVariants, productImages, orders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
  const isFeatured = formData.get('isFeatured') === 'on';
  const isActive = formData.get('isActive') === 'on';
  const imageUrls = formData.getAll('imageUrls') as string[];

  // Variants
  const variantSizes = formData.getAll('variant_size') as string[];
  const variantColors = formData.getAll('variant_color') as string[];
  const variantStocks = formData.getAll('variant_stock') as string[];

  // Basic validation
  if (!name || isNaN(price)) {
    return { error: 'Invalid data' };
  }

  const [newProduct] = await db.insert(products).values({
    name,
    description,
    price: price.toString(),
    category,
    stockQuantity,
    isFeatured,
    isActive,
    imageUrls: imageUrls.filter(url => url.length > 0),
    imageUrl: imageUrls[0] || null,
  }).returning();

  // Handle variants
  if (variantSizes.length > 0) {
      const variantsToInsert = variantSizes.map((size, index) => ({
          productId: newProduct.id,
          size: size || null,
          color: variantColors[index] || null,
          stockQuantity: parseInt(variantStocks[index]) || 0,
          priceAdjustment: '0', // Default
      }));

      // Filter out empty variants (if any)
      const validVariants = variantsToInsert.filter(v => v.size || v.color);

      if (validVariants.length > 0) {
          await db.insert(productVariants).values(validVariants);
      }
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products'); // Redirects to tab=products usually, or just page reload
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath('/admin/products');
  revalidatePath('/products');
}

export async function updateOrderStatus(orderId: string, status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded") {
  await db.update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));
  revalidatePath('/admin/orders');
}
