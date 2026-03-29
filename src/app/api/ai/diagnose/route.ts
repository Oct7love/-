import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";
import {
  RESUME_SCORER_SYSTEM_PROMPT,
  RESUME_SCORER_USER_PROMPT,
} from "@/lib/ai/prompts/resume-scorer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const { resumeContent } = await req.json();

    if (!resumeContent) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "简历内容不能为空" },
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    const { text, usage } = await generateText({
      model: deepseek(MODELS.chat),
      system: RESUME_SCORER_SYSTEM_PROMPT,
      prompt: RESUME_SCORER_USER_PROMPT(JSON.stringify(resumeContent, null, 2)),
      temperature: 0.3,
      maxOutputTokens: 4000,
    });

    const processingTime = Date.now() - startTime;

    let diagnosisResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      diagnosisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AI_SERVICE_UNAVAILABLE",
            message: "AI 返回格式异常，请重试",
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...diagnosisResult,
        modelUsed: MODELS.chat,
        tokensUsed: usage?.totalTokens ?? 0,
        processingTimeMs: processingTime,
      },
    });
  } catch (error) {
    console.error("Diagnosis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_SERVICE_UNAVAILABLE",
          message: "AI 服务暂时不可用，请稍后重试",
        },
      },
      { status: 503 }
    );
  }
}
