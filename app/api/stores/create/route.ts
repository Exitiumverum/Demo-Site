import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createStoreForUser } from "@/lib/stores";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug, phone, address, logoUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a store
    const existingStore = await db.store.findFirst({
      where: { ownerId: user.id },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "User already has a store" },
        { status: 400 }
      );
    }

    const store = await createStoreForUser({
      ownerId: user.id,
      name,
      slug,
      phone,
      address,
      logoUrl,
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store creation error:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}

