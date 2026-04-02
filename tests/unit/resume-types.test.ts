import { describe, it, expect } from "vitest";
import type {
  ResumeContent,
  PersonalInfo,
  Education,
  WorkExperience,
  Project,
  Skills,
  DiagnosisResult,
  DiagnosisItem,
  DiagnosisSeverity,
  RewriteStyle,
} from "@/types/resume";

describe("Resume types", () => {
  it("should create a valid ResumeContent", () => {
    const content: ResumeContent = {
      personalInfo: {
        name: "张三",
        phone: "13800138000",
        email: "zhangsan@example.com",
        location: "北京",
        summary: "5年前端开发经验",
      },
      education: [
        {
          id: "edu-1",
          school: "北京大学",
          degree: "本科",
          major: "计算机科学",
          startDate: "2016-09",
          endDate: "2020-06",
        },
      ],
      workExperience: [
        {
          id: "work-1",
          company: "字节跳动",
          position: "前端开发工程师",
          startDate: "2020-07",
          isCurrent: true,
          description: "负责前端开发",
          highlights: ["主导性能优化项目"],
        },
      ],
      projects: [
        {
          id: "proj-1",
          name: "推荐系统",
          role: "技术负责人",
          description: "搭建推荐系统",
          highlights: ["提升点击率20%"],
          techStack: ["React", "Node.js"],
        },
      ],
      skills: {
        technical: ["TypeScript", "React"],
        soft: ["团队协作"],
        languages: [{ name: "英语", level: "流利" }],
        certifications: ["AWS SAA"],
      },
      customSections: [],
      sectionOrder: ["personalInfo", "education", "workExperience", "projects", "skills"],
    };

    expect(content.personalInfo.name).toBe("张三");
    expect(content.education).toHaveLength(1);
    expect(content.workExperience[0].isCurrent).toBe(true);
    expect(content.projects[0].techStack).toContain("React");
    expect(content.skills.technical).toContain("TypeScript");
    expect(content.sectionOrder).toHaveLength(5);
  });

  it("should create a valid DiagnosisResult", () => {
    const result: DiagnosisResult = {
      totalScore: 72,
      dimensions: {
        completeness: { score: 18, maxScore: 20, level: "good", feedback: "内容完整" },
        contentQuality: { score: 20, maxScore: 30, level: "warning", feedback: "需要更多量化数据" },
        keywords: { score: 12, maxScore: 20, level: "warning", feedback: "关键词不够" },
        formatting: { score: 13, maxScore: 15, level: "good", feedback: "格式规范" },
        impression: { score: 9, maxScore: 15, level: "warning", feedback: "可以突出更多" },
      },
      overallSummary: "简历整体不错，但需要增加量化数据",
    };

    expect(result.totalScore).toBe(72);
    expect(Object.keys(result.dimensions)).toHaveLength(5);
    expect(result.dimensions.completeness.level).toBe("good");
  });

  it("should create valid DiagnosisItems", () => {
    const items: DiagnosisItem[] = [
      {
        id: "item-1",
        section: "workExperience",
        fieldPath: "workExperience[0].highlights[0]",
        severity: "critical",
        category: "quantification",
        originalText: "负责前端性能优化",
        suggestion: "添加具体的量化数据",
        rewrittenText: "主导前端性能优化项目，将首屏加载时间从 3.2s 降至 1.8s",
        isAdopted: false,
      },
      {
        id: "item-2",
        section: "skills",
        fieldPath: "skills.technical",
        severity: "warning",
        category: "keyword",
        originalText: "",
        suggestion: "建议添加微服务、CI/CD等关键词",
        isAdopted: false,
      },
    ];

    expect(items).toHaveLength(2);
    expect(items[0].severity).toBe("critical");
    expect(items[1].rewrittenText).toBeUndefined();
  });

  it("should have valid severity types", () => {
    const severities: DiagnosisSeverity[] = ["critical", "warning", "info"];
    expect(severities).toContain("critical");
    expect(severities).toContain("warning");
    expect(severities).toContain("info");
  });

  it("should have valid rewrite styles", () => {
    const styles: RewriteStyle[] = ["professional", "concise", "creative"];
    expect(styles).toHaveLength(3);
  });
});
