import { db } from "./db";
import type { Order, CartItem } from "./types";

/**
 * Get all orders for a store
 */
export async function getOrdersByStore(storeId: string): Promise<Order[]> {
  return await db.order.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  return await db.order.findUnique({
    where: { id: orderId },
  });
}

/**
 * Create a new order
 */
export async function createOrder(data: {
  storeId: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items: CartItem[];
  totalPrice: number;
  status?: string;
}) {
  return await db.order.create({
    data: {
      ...data,
      items: data.items as any, // Prisma Json type
      status: data.status || "new",
    },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  return await db.order.update({
    where: { id: orderId },
    data: { status },
  });
}

