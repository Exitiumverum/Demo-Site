import OpenAI from "openai";

// Initialize OpenAI client
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. AI features will not work.");
}

export async function generateProductContent(params: {
  title: string;
  category?: string;
  storeName?: string;
}): Promise<{ description: string; seoTitle: string; seoDescription: string }> {
  if (!client) {
    throw new Error("OpenAI API key is not configured");
  }

  const { title, category, storeName } = params;

  const prompt = `אתה כותב תוכן שיווקי בעברית לאתר איקומרס.

שם המוצר: "${title}"
קטגוריה: ${category || "לא צוין"}
שם החנות: ${storeName || "החנות"}

תן לי:
1. תיאור מוצר שיווקי בפסקה אחת-שתיים (לא יותר מ-120 מילים).
2. כותרת SEO קצרה (עד 60 תווים).
3. תיאור SEO (עד 150 תווים).

הפורמט חייב להיות JSON תקין:
{
  "description": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini (cheaper alternative)
      messages: [
        {
          role: "system",
          content: "You are a marketing content writer for e-commerce websites. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(rawContent);

    return {
      description: (data.description as string) || "",
      seoTitle: (data.seoTitle as string) || "",
      seoDescription: (data.seoDescription as string) || "",
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Handle specific OpenAI errors
    if (error?.status === 429) {
      if (error?.code === "insufficient_quota") {
        throw new Error("OpenAI quota exceeded. Please check your billing and plan details.");
      }
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    }
    
    if (error?.status === 401) {
      throw new Error("OpenAI API key is invalid. Please check your API key.");
    }
    
    if (error?.message?.includes("API key")) {
      throw new Error("OpenAI API key is not configured or invalid.");
    }
    
    // Generic error
    throw new Error(error?.message || "Failed to generate product content. Please try again.");
  }
}

