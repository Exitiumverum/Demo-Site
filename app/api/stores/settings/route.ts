import { NextRequest, NextResponse } from "next/server";
import { updateStore, updateStoreSettings } from "@/lib/stores";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeId,
      name,
      slug,
      phone,
      address,
      logoUrl,
      paymentProvider,
      paymentPublicKey,
      paymentSecretKey,
      paymentRedirectUrl,
    } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Update store basic info
    if (name || slug || phone !== undefined || address !== undefined || logoUrl !== undefined) {
      await updateStore(storeId, {
        name,
        slug,
        phone: phone || null,
        address: address || null,
        logoUrl: logoUrl || null,
      });
    }

    // Update store settings
    if (
      paymentProvider !== undefined ||
      paymentPublicKey !== undefined ||
      paymentSecretKey !== undefined ||
      paymentRedirectUrl !== undefined
    ) {
      await updateStoreSettings(storeId, {
        paymentProvider: paymentProvider === "none" ? null : paymentProvider || null,
        paymentPublicKey: paymentPublicKey || null,
        paymentSecretKey: paymentSecretKey || null,
        paymentRedirectUrl: paymentRedirectUrl || null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

