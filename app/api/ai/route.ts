import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * App Router Route Handler — uses Google Gemini (free tier via Google AI Studio).
 * Server-only secret: GEMINI_API_KEY (never NEXT_PUBLIC_*).
 */
export const runtime = "nodejs";

type ChatRequestBody = {
  message?: string;
  prompt?: string;
};

type ChatSuccessJson = { message: string };
type ChatErrorJson = { error: string };

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Server misconfiguration: GEMINI_API_KEY is not set. Get a free key at Google AI Studio and add it to .env.local."
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // gemini-1.5-flash often has its own free-tier quota vs 2.0; override with GEMINI_MODEL if you prefer.
  const modelName = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  return genAI.getGenerativeModel({ model: modelName });
}

export async function POST(request: Request): Promise<NextResponse<ChatSuccessJson | ChatErrorJson>> {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = (typeof body.message === "string" ? body.message : body.prompt)?.trim();
  if (!text) {
    return NextResponse.json(
      { error: "Missing message (or prompt) in request body" },
      { status: 400 }
    );
  }

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(text);
    const response = result.response;
    const content = response.text();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Model returned an empty reply" }, { status: 502 });
    }

    return NextResponse.json({ message: content });
  } catch (err) {
    console.error("[api/ai] Gemini error:", err);

    if (err instanceof GoogleGenerativeAIFetchError) {
      const status = err.status ?? 502;
      const friendly =
        status === 429
          ? "Gemini rate limit or free-tier quota exceeded. Wait a minute and try again, pick another model (GEMINI_MODEL), or check Google AI Studio usage and billing."
          : err.message;
      return NextResponse.json({ error: friendly }, { status });
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Gemini request failed: ${message}` },
      { status: 500 }
    );
  }
}
