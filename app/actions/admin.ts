'use server';

import { db } from '@/lib/db';
import { products, productVariants, productImages, orders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/upload';

// Helper to convert FormData Entry to File (not needed if we use get)
// But we need to handle the File object in node environment for supabase upload.
// lib/upload.ts uses supabase.storage.from(...).upload(name, file)
// 'file' in upload() type is 'File'.
// In Server Actions, formData.get('image') returns a File object which is compatible with fetch/FormData standard.

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
  const isFeatured = formData.get('isFeatured') === 'on';
  const isActive = formData.get('isActive') === 'on';
  const imageFile = formData.get('image') as File;

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
      try {
          imageUrl = await uploadImage(imageFile);
      } catch (e) {
          console.error("Upload failed", e);
          // Continue without image or return error?
      }
  }

  // Variants
  const variantSizes = formData.getAll('variant_size') as string[];
  const variantColors = formData.getAll('variant_color') as string[];
  const variantStocks = formData.getAll('variant_stock') as string[];

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
    imageUrl: imageUrl,
    imageUrls: imageUrl ? [imageUrl] : null,
  }).returning();

  if (variantSizes.length > 0) {
      const variantsToInsert = variantSizes.map((size, index) => ({
          productId: newProduct.id,
          size: size || null,
          color: variantColors[index] || null,
          stockQuantity: parseInt(variantStocks[index]) || 0,
          priceAdjustment: '0',
      }));

      const validVariants = variantsToInsert.filter(v => v.size || v.color);

      if (validVariants.length > 0) {
          await db.insert(productVariants).values(validVariants);
      }
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;

    await db.update(products)
        .set({
            name,
            price: price,
            stockQuantity,
            updatedAt: new Date()
        })
        .where(eq(products.id, id));

    revalidatePath('/admin/products');
    revalidatePath('/products');
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
