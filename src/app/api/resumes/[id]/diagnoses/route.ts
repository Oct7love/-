import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes, diagnoses } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  const { id } = await params;

  const [resume] = await db
    .select({ id: resumes.id })
    .from(resumes)
    .where(
      and(
        eq(resumes.id, id),
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    )
    .limit(1);

  if (!resume) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "简历不存在" } },
      { status: 404 }
    );
  }

  const diagnosisList = await db
    .select({
      id: diagnoses.id,
      totalScore: diagnoses.totalScore,
      dimensions: diagnoses.dimensions,
      overallSummary: diagnoses.overallSummary,
      modelUsed: diagnoses.modelUsed,
      tokensUsed: diagnoses.tokensUsed,
      processingTimeMs: diagnoses.processingTimeMs,
      createdAt: diagnoses.createdAt,
    })
    .from(diagnoses)
    .where(eq(diagnoses.resumeId, id))
    .orderBy(desc(diagnoses.createdAt))
    .limit(20);

  return NextResponse.json({
    success: true,
    data: diagnosisList,
    meta: { total: diagnosisList.length },
  });
}
