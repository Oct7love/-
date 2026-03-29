import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { streamText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";
import {
  RESUME_REWRITER_SYSTEM_PROMPT,
  RESUME_REWRITER_USER_PROMPT,
} from "@/lib/ai/prompts/resume-rewriter";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { originalText, style = "concise", context } = await req.json();

    if (!originalText) {
      return new Response(
        JSON.stringify({ error: "originalText is required" }),
        { status: 400 }
      );
    }

    const result = streamText({
      model: deepseek(MODELS.chat),
      system: RESUME_REWRITER_SYSTEM_PROMPT,
      prompt: RESUME_REWRITER_USER_PROMPT(originalText, style, context),
      temperature: 0.7,
      maxOutputTokens: 1000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Rewrite error:", error);
    return new Response(JSON.stringify({ error: "AI service unavailable" }), {
      status: 503,
    });
  }
}
