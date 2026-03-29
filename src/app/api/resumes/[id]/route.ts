import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
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

  try {
    const body = await req.json();

    const [updated] = await db
      .update(resumes)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
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
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
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
