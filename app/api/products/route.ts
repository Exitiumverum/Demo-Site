import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, title, description, price, imageUrl, category, stock, seoTitle, seoDescription } = body;

    if (!storeId || !title || !description || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      storeId,
      title,
      description,
      price,
      imageUrl: imageUrl || null,
      category: category || null,
      stock: stock || 0,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

