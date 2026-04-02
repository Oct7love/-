import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes, resumeVersions } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

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
    .select()
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

  return NextResponse.json({ success: true, data: resume });
}

export async function PATCH(
  req: NextRequest,
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

  const updateResumeSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.record(z.unknown()).optional(),
    status: z.enum(["draft", "completed", "archived"]).optional(),
    templateId: z.string().uuid().nullable().optional(),
    templateConfig: z.record(z.unknown()).optional(),
    lastScore: z.number().int().min(0).max(100).optional(),
    lastDiagnosedAt: z.coerce.date().optional(),
  });

  try {
    const body = await req.json();
    const parsed = updateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "请求参数校验失败",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // Create a version snapshot if content is being updated
    if (parsed.data.content) {
      try {
        const [current] = await db
          .select({
            content: resumes.content,
            currentVersion: resumes.currentVersion,
          })
          .from(resumes)
          .where(
            and(
              eq(resumes.id, id),
              eq(resumes.userId, session.user.id),
              isNull(resumes.deletedAt)
            )
          )
          .limit(1);

        if (current && current.content) {
          const nextVersion = (current.currentVersion ?? 0) + 1;
          await db.insert(resumeVersions).values({
            resumeId: id,
            versionNumber: nextVersion,
            content: current.content,
            changeSummary: "自动保存",
            changeType: "manual",
          });
          parsed.data = { ...parsed.data, currentVersion: nextVersion } as typeof parsed.data & { currentVersion: number };
        }
      } catch (vErr) {
        console.error("Version creation failed:", vErr);
      }
    }

    const [updated] = await db
      .update(resumes)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(resumes.id, id),
          eq(resumes.userId, session.user.id),
          isNull(resumes.deletedAt)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "简历不存在" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update resume error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

  const [deleted] = await db
    .update(resumes)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(resumes.id, id),
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    )
    .returning({ id: resumes.id });

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "简历不存在" } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { message: "简历已删除" },
  });
}
