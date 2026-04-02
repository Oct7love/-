import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { z } from "zod";
import { checkResumeLimit } from "@/lib/usage";

const createResumeSchema = z.object({
  title: z.string().min(1).max(200).default("未命名简历"),
  language: z.string().default("zh-CN"),
  sourceType: z.enum(["upload", "manual", "template"]).default("manual"),
  templateId: z.string().uuid().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  const userResumes = await db
    .select({
      id: resumes.id,
      title: resumes.title,
      status: resumes.status,
      language: resumes.language,
      lastScore: resumes.lastScore,
      templateId: resumes.templateId,
      lastDiagnosedAt: resumes.lastDiagnosedAt,
      updatedAt: resumes.updatedAt,
      createdAt: resumes.createdAt,
    })
    .from(resumes)
    .where(
      and(
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    )
    .orderBy(desc(resumes.updatedAt));

  return NextResponse.json({
    success: true,
    data: userResumes,
    meta: { total: userResumes.length },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createResumeSchema.safeParse(body);

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

    const quota = await checkResumeLimit(session.user.id);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PLAN_LIMIT_REACHED",
            message: quota.message ?? "简历数量已达上限",
          },
        },
        { status: 429 }
      );
    }

    const defaultContent = {
      personalInfo: { name: "", email: "", phone: "", location: "", summary: "" },
      education: [],
      workExperience: [],
      projects: [],
      skills: { technical: [], soft: [], languages: [], certifications: [] },
      customSections: [],
      sectionOrder: [
        "personalInfo",
        "education",
        "workExperience",
        "projects",
        "skills",
      ],
    };

    const [newResume] = await db
      .insert(resumes)
      .values({
        userId: session.user.id,
        title: parsed.data.title,
        language: parsed.data.language,
        sourceType: parsed.data.sourceType,
        templateId: parsed.data.templateId,
        content: defaultContent,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newResume },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create resume error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
