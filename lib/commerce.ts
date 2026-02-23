import { db } from '@/lib/db';
import { products, productVariants, productImages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getProducts() {
  return await db.query.products.findMany({
    with: {
      variants: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
    },
    orderBy: [desc(products.createdAt)],
  });
}

export async function getProduct(slug: string) {
  // Assuming slug is name for now or ID. Let's use ID as primary but maybe implement slug later.
  // Actually HiyoRi likely uses ID in URL or Slug. Let's assume ID for simplicity or add slug column.
  // The schema I created didn't have slug. I should add slug to products.

  // For now, let's fetch by ID if it's a UUID, otherwise fail.
  // Or fetch by name? Name is not unique.

  // Let's add slug to the schema in a migration later if needed, but for now let's assume getProduct takes ID.
  return await db.query.products.findFirst({
    where: eq(products.id, slug), // slug acts as ID here
    with: {
      variants: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
    },
  });
}

export async function getProductBySlug(slug: string) {
    // If I don't have slug column, I'll filter by name or ID.
    // Let's try to query by name, but slugified? No, that's unreliable.
    // I will assume the URL contains the ID for now (e.g. /product/[id]).
    return getProduct(slug);
}

export async function getFeaturedProducts() {
  return await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    with: {
      variants: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
    },
    limit: 4,
  });
}
