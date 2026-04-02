import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "ai";
import { deepseek, MODELS } from "@/lib/ai/client";
import {
  RESUME_PARSER_SYSTEM_PROMPT,
  RESUME_PARSER_USER_PROMPT,
} from "@/lib/ai/prompts/resume-parser";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "请上传文件" },
        },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FILE_TOO_LARGE", message: "文件大小不能超过 10MB" },
        },
        { status: 413 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_FILE_TYPE",
            message: "仅支持 PDF、DOCX、TXT 格式",
          },
        },
        { status: 415 }
      );
    }

    let textContent = "";

    if (file.type === "text/plain") {
      textContent = await file.text();
    } else if (file.type === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { extractPdfText } = await import("@/lib/pdf-helper");
      textContent = await extractPdfText(buffer);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      textContent = result.value;
    } else {
      textContent = await file.text();
    }

    if (!textContent.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESUME_PARSE_FAILED",
            message: "无法从文件中提取文本内容",
          },
        },
        { status: 422 }
      );
    }

    const { text } = await generateText({
      model: deepseek(MODELS.chat),
      system: RESUME_PARSER_SYSTEM_PROMPT,
      prompt: RESUME_PARSER_USER_PROMPT(textContent),
      temperature: 0.1,
      maxOutputTokens: 4000,
    });

    let parsedContent;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESUME_PARSE_FAILED",
            message: "AI 解析返回格式异常，请重试",
          },
        },
        { status: 422 }
      );
    }

    const finalContent = {
      personalInfo: parsedContent.personalInfo || { name: "" },
      education: (parsedContent.education || []).map(
        (e: Record<string, unknown>) => ({
          id: crypto.randomUUID(),
          ...e,
        })
      ),
      workExperience: (parsedContent.workExperience || []).map(
        (e: Record<string, unknown>) => ({
          id: crypto.randomUUID(),
          ...e,
        })
      ),
      projects: (parsedContent.projects || []).map(
        (e: Record<string, unknown>) => ({
          id: crypto.randomUUID(),
          ...e,
        })
      ),
      skills: parsedContent.skills || {
        technical: [],
        soft: [],
        languages: [],
        certifications: [],
      },
      customSections: [],
      sectionOrder: [
        "personalInfo",
        "education",
        "workExperience",
        "projects",
        "skills",
      ],
    };

    return NextResponse.json({
      success: true,
      data: {
        parsedContent: finalContent,
        sourceFileName: file.name,
        parseConfidence: 0.9,
      },
    });
  } catch (error) {
    console.error("Upload parse error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "文件处理失败，请重试",
        },
      },
      { status: 500 }
    );
  }
}
