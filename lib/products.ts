import { db } from "./db";
import type { Product } from "./types";

/**
 * Get all products for a store
 */
export async function getProductsByStore(storeId: string): Promise<Product[]> {
  return await db.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  return await db.product.findUnique({
    where: { id: productId },
  });
}

/**
 * Get featured products (first N products) for a store
 */
export async function getFeaturedProducts(storeId: string, limit: number = 6): Promise<Product[]> {
  return await db.product.findMany({
    where: { storeId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Create a new product
 */
export async function createProduct(data: {
  storeId: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  stock?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  return await db.product.create({
    data: {
      storeId: data.storeId,
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
      category: data.category ?? null,
      stock: data.stock ?? 0,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    },
  });
}

/**
 * Update a product
 */
export async function updateProduct(
  productId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string | null;
    category?: string | null;
    stock?: number;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }
) {
  return await db.product.update({
    where: { id: productId },
    data,
  });
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  return await db.product.delete({
    where: { id: productId },
  });
}

