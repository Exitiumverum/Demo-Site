import { Store, Product, Order, User } from "@prisma/client";

export type { Store, Product, Order, User };

export interface CartItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  title: string;
  imageUrl?: string;
}

export interface StoreWithSettings extends Store {
  settings: {
    paymentProvider: string | null;
    paymentPublicKey: string | null;
    paymentSecretKey: string | null;
    paymentRedirectUrl: string | null;
  } | null;
}

export interface ProductWithStore extends Product {
  store: Store;
}

export interface OrderWithItems extends Omit<Order, 'items'> {
  items: CartItem[];
}

