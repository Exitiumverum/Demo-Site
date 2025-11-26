import { NextResponse } from "next/server";
import { generateProductContent } from "@/lib/ai";
import { getCurrentUser, getActiveStore } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const store = await getActiveStore();
    if (!store) {
      return NextResponse.json(
        { error: "No active store" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, category } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Missing title" },
        { status: 400 }
      );
    }

    const result = await generateProductContent({
      title,
      category,
      storeName: store.name,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI generation error:", error);
    
    // Return specific error message if available
    const errorMessage = error?.message || "Failed to generate content";
    
    // Determine appropriate status code
    let status = 500;
    if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      status = 429;
    } else if (errorMessage.includes("API key") || errorMessage.includes("Unauthorized")) {
      status = 401;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

