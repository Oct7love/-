import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";
import {
  JD_MATCHER_SYSTEM_PROMPT,
  JD_MATCHER_USER_PROMPT,
} from "@/lib/ai/prompts/jd-matcher";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const { resumeContent, jdContent, companyName, positionTitle } =
      await req.json();

    if (!resumeContent || !jdContent) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "简历内容和 JD 内容不能为空",
          },
        },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: deepseek(MODELS.chat),
      system: JD_MATCHER_SYSTEM_PROMPT,
      prompt: JD_MATCHER_USER_PROMPT(
        JSON.stringify(resumeContent, null, 2),
        jdContent
      ),
      temperature: 0.3,
      maxOutputTokens: 3000,
    });

    let matchResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      matchResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
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
        ...matchResult,
        companyName,
        positionTitle,
      },
    });
  } catch (error) {
    console.error("JD match error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_SERVICE_UNAVAILABLE",
          message: "AI 服务暂时不可用",
        },
      },
      { status: 503 }
    );
  }
}
