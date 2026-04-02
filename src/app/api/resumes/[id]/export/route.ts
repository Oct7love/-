import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(
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
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id), isNull(resumes.deletedAt)))
      .limit(1);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "简历不存在" },
        },
        { status: 404 }
      );
    }

    // MVP: Return HTML that can be printed as PDF via browser
    // Production: Use Puppeteer or @react-pdf/renderer
    const htmlContent = generateResumeHTML(
      resume.content as Record<string, unknown>,
      resume.title
    );

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${resume.title.replace(/[^\w\u4e00-\u9fff.-]/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "EXPORT_FAILED", message: "导出失败" },
      },
      { status: 500 }
    );
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateResumeHTML(
  content: Record<string, unknown>,
  title: string
): string {
  const c = content as {
    personalInfo?: {
      name?: string;
      phone?: string;
      email?: string;
      location?: string;
      summary?: string;
    };
    education?: {
      school?: string;
      degree?: string;
      major?: string;
      startDate?: string;
      endDate?: string;
    }[];
    workExperience?: {
      company?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      highlights?: string[];
    }[];
    projects?: {
      name?: string;
      role?: string;
      description?: string;
      techStack?: string[];
    }[];
    skills?: { technical?: string[]; certifications?: string[] };
  };

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${esc(title)}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; font-size: 11px; line-height: 1.6; color: #1a1a1a; max-width: 210mm; margin: 0 auto; padding: 20px; }
    h1 { font-size: 22px; color: #059669; text-align: center; }
    .contact { text-align: center; color: #666; margin-top: 6px; }
    .summary { text-align: center; color: #555; margin-top: 8px; max-width: 480px; margin-left: auto; margin-right: auto; }
    .divider { height: 1px; background: #e5e7eb; margin: 12px 0; }
    h2 { font-size: 13px; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 2px solid #d1fae5; padding-bottom: 3px; }
    .item { margin-bottom: 10px; }
    .item-header { display: flex; justify-content: space-between; }
    .item-header .title { font-weight: 600; }
    .item-header .date { color: #999; font-size: 10px; }
    .item-sub { color: #666; font-style: italic; }
    ul { padding-left: 16px; }
    li { margin-bottom: 2px; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .skill-tag { background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${esc(c.personalInfo?.name || "姓名")}</h1>
  <div class="contact">
    ${[c.personalInfo?.phone, c.personalInfo?.email, c.personalInfo?.location].filter(Boolean).map(esc).join(" · ")}
  </div>
  ${c.personalInfo?.summary ? `<div class="summary">${esc(c.personalInfo.summary)}</div>` : ""}
  <div class="divider"></div>

  ${
    c.education?.length
      ? `<h2>教育背景</h2>${c.education
          .map(
            (e) => `<div class="item">
    <div class="item-header"><span class="title">${esc(e.school ?? "")}</span><span class="date">${esc(e.startDate ?? "")} — ${esc(e.endDate ?? "")}</span></div>
    <div class="item-sub">${esc(e.degree ?? "")} · ${esc(e.major ?? "")}</div>
  </div>`
          )
          .join("")}`
      : ""
  }

  ${
    c.workExperience?.length
      ? `<h2>工作经历</h2>${c.workExperience
          .map(
            (e) => `<div class="item">
    <div class="item-header"><span class="title">${esc(e.company ?? "")}</span><span class="date">${esc(e.startDate ?? "")} — ${e.isCurrent ? "至今" : esc(e.endDate ?? "")}</span></div>
    <div class="item-sub">${esc(e.position ?? "")}</div>
    ${e.highlights?.filter(Boolean).length ? `<ul>${e.highlights.filter(Boolean).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
  </div>`
          )
          .join("")}`
      : ""
  }

  ${
    c.projects?.length
      ? `<h2>项目经历</h2>${c.projects
          .map(
            (p) => `<div class="item">
    <div class="item-header"><span class="title">${esc(p.name ?? "")}</span></div>
    ${p.role ? `<div class="item-sub">${esc(p.role)}</div>` : ""}
    ${p.description ? `<div>${esc(p.description)}</div>` : ""}
    ${p.techStack?.length ? `<div class="skills-list" style="margin-top:4px">${p.techStack.map((t) => `<span class="skill-tag">${esc(t)}</span>`).join("")}</div>` : ""}
  </div>`
          )
          .join("")}`
      : ""
  }

  ${
    c.skills?.technical?.length
      ? `<h2>技能特长</h2><div class="skills-list">${c.skills.technical.map((s) => `<span class="skill-tag">${esc(s)}</span>`).join("")}</div>`
      : ""
  }
  ${c.skills?.certifications?.length ? `<div style="margin-top:6px"><strong>证书：</strong>${c.skills.certifications.map(esc).join(", ")}</div>` : ""}
</body>
</html>`;
}
