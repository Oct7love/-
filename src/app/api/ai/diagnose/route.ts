import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { diagnoses, diagnosisItems, resumes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkQuota, recordUsage } from "@/lib/usage";
import {
  RESUME_SCORER_SYSTEM_PROMPT,
  RESUME_SCORER_USER_PROMPT,
} from "@/lib/ai/prompts/resume-scorer";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  const quota = await checkQuota(session.user.id, "diagnose");
  if (!quota.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "QUOTA_EXCEEDED", message: quota.message ?? "配额已用完" },
      },
      { status: 429 }
    );
  }

  try {
    const { resumeContent, resumeId } = await req.json();

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

    // Persist diagnosis to database
    const tokensUsed = usage?.totalTokens ?? 0;

    if (resumeId) {
      try {
        const [diagRecord] = await db
          .insert(diagnoses)
          .values({
            resumeId,
            userId: session.user.id,
            totalScore: diagnosisResult.totalScore,
            dimensions: diagnosisResult.dimensions,
            overallSummary: diagnosisResult.overallSummary,
            modelUsed: MODELS.chat,
            tokensUsed,
            processingTimeMs: processingTime,
          })
          .returning({ id: diagnoses.id });

        if (diagRecord && diagnosisResult.items?.length) {
          await db.insert(diagnosisItems).values(
            diagnosisResult.items.map(
              (item: Record<string, unknown>, i: number) => ({
                diagnosisId: diagRecord.id,
                section: (item.section as string) ?? "unknown",
                fieldPath: item.fieldPath as string,
                severity: (item.severity as string) ?? "info",
                category: (item.category as string) ?? "general",
                originalText: item.originalText as string,
                suggestion: (item.suggestion as string) ?? "",
                rewrittenText: item.rewrittenText as string,
                sortOrder: i,
              })
            )
          );
        }

        // Update resume score
        await db
          .update(resumes)
          .set({
            lastScore: diagnosisResult.totalScore,
            lastDiagnosedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(resumes.id, resumeId));
      } catch (dbErr) {
        console.error("Failed to persist diagnosis:", dbErr);
      }
    }

    // Record usage
    await recordUsage(session.user.id, "diagnose", {
      resumeId,
      tokensUsed,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...diagnosisResult,
        modelUsed: MODELS.chat,
        tokensUsed,
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
