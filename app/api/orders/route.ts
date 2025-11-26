import { NextRequest, NextResponse } from "next/server";
import { getStoreBySlug } from "@/lib/stores";
import { createOrder } from "@/lib/orders";
import type { CartItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeSlug,
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalPrice,
    } = body;

    if (!storeSlug || !customerName || !items || totalPrice === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const store = await getStoreBySlug(storeSlug);
    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // TODO: Integrate payment gateway here (Tranzila, Cardcom, etc.)
    // For now, we'll create the order directly

    const order = await createOrder({
      storeId: store.id,
      customerName,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || null,
      items: items as CartItem[],
      totalPrice,
      status: "new",
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

