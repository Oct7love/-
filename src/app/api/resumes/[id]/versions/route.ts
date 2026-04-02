import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes, resumeVersions } from "@/lib/db/schema";
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

  const versions = await db
    .select({
      id: resumeVersions.id,
      versionNumber: resumeVersions.versionNumber,
      changeSummary: resumeVersions.changeSummary,
      changeType: resumeVersions.changeType,
      createdAt: resumeVersions.createdAt,
    })
    .from(resumeVersions)
    .where(eq(resumeVersions.resumeId, id))
    .orderBy(desc(resumeVersions.versionNumber));

  return NextResponse.json({
    success: true,
    data: versions,
    meta: { total: versions.length },
  });
}
