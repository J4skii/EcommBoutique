import { db } from '@/lib/db';
import { products, productVariants, productImages } from '@/lib/db/schema';
import { eq, desc, ilike } from 'drizzle-orm';

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
  return await db.query.products.findFirst({
    where: eq(products.id, slug),
    with: {
      variants: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
    },
  });
}

export async function searchProducts(query: string) {
    return await db.query.products.findMany({
        where: ilike(products.name, `%${query}%`),
        with: {
            variants: true,
            images: {
                orderBy: (images, { asc }) => [asc(images.displayOrder)],
            },
        },
        orderBy: [desc(products.createdAt)],
    });
}

export async function getProductBySlug(slug: string) {
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
