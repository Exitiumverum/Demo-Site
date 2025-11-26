import { db } from "./db";
import { slugify } from "./utils";
import type { StoreWithSettings } from "./types";

/**
 * Get a store by its slug
 */
export async function getStoreBySlug(slug: string): Promise<StoreWithSettings | null> {
  const store = await db.store.findUnique({
    where: { slug },
    include: {
      settings: true,
    },
  });

  return store;
}

/**
 * Get a store by ID
 */
export async function getStoreById(id: string) {
  return await db.store.findUnique({
    where: { id },
    include: {
      settings: true,
    },
  });
}

/**
 * Update store settings
 */
export async function updateStoreSettings(
  storeId: string,
  data: {
    paymentProvider?: string | null;
    paymentPublicKey?: string | null;
    paymentSecretKey?: string | null;
    paymentRedirectUrl?: string | null;
  }
) {
  return await db.storeSettings.upsert({
    where: { storeId },
    create: {
      storeId,
      ...data,
    },
    update: data,
  });
}

/**
 * Update store basic info
 */
export async function updateStore(
  storeId: string,
  data: {
    name?: string;
    slug?: string;
    phone?: string | null;
    address?: string | null;
    logoUrl?: string | null;
  }
) {
  return await db.store.update({
    where: { id: storeId },
    data,
  });
}

/**
 * Create a store for a user
 * Ensures slug uniqueness by appending numbers if needed
 */
export async function createStoreForUser(params: {
  ownerId: string;
  name: string;
  slug?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
}) {
  const baseSlug = params.slug || slugify(params.name);
  let slug = baseSlug;
  let counter = 1;

  // Ensure uniqueness of slug
  while (true) {
    const existing = await db.store.findUnique({
      where: { slug },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const store = await db.store.create({
    data: {
      ownerId: params.ownerId,
      name: params.name,
      slug,
      phone: params.phone || null,
      address: params.address || null,
      logoUrl: params.logoUrl || null,
      settings: {
        create: {},
      },
    },
    include: {
      settings: true,
    },
  });

  return store;
}

