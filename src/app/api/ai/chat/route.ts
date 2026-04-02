import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { streamText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";

const SYSTEM_PROMPT = `你是 Oct7 的 AI 简历助手。你的职责是帮助用户优化简历。

你可以帮助：
- 简历写作建议（如何描述工作经历、项目经历）
- 量化数据建议（如何添加数字来增强说服力）
- 面试准备建议
- 求职策略
- 简历格式和排版建议
- 行业关键词建议

回答要简洁实用，用中文回复。如果用户的问题与简历/求职无关，礼貌地引导回简历话题。`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const result = streamText({
      model: deepseek(MODELS.chat),
      system: SYSTEM_PROMPT,
      prompt: message,
      temperature: 0.7,
      maxOutputTokens: 800,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("AI service unavailable", { status: 503 });
  }
}
