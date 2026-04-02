import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "@/stores/editor-store";
import type { ResumeContent, DiagnosisResult } from "@/types/resume";

const mockContent: ResumeContent = {
  personalInfo: {
    name: "张三",
    phone: "13800138000",
    email: "test@example.com",
    location: "北京",
    summary: "测试用户",
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: { technical: [], soft: [], languages: [], certifications: [] },
  customSections: [],
  sectionOrder: ["personalInfo", "education", "workExperience", "projects", "skills"],
};

const mockDiagnosis: DiagnosisResult = {
  totalScore: 72,
  dimensions: {
    completeness: { score: 18, maxScore: 20, level: "good", feedback: "OK" },
    contentQuality: { score: 20, maxScore: 30, level: "warning", feedback: "需改进" },
    keywords: { score: 12, maxScore: 20, level: "warning", feedback: "不足" },
    formatting: { score: 13, maxScore: 15, level: "good", feedback: "OK" },
    impression: { score: 9, maxScore: 15, level: "warning", feedback: "一般" },
  },
  overallSummary: "整体不错",
};

describe("EditorStore", () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it("should have correct initial state", () => {
    const state = useEditorStore.getState();
    expect(state.resumeId).toBeNull();
    expect(state.content).toBeNull();
    expect(state.isDirty).toBe(false);
    expect(state.isSaving).toBe(false);
    expect(state.activeSection).toBe("personalInfo");
    expect(state.diagnosis).toBeNull();
    expect(state.diagnosisItems).toEqual([]);
    expect(state.isDiagnosing).toBe(false);
    expect(state.isRewriting).toBe(false);
    expect(state.rewriteTarget).toBeNull();
  });

  it("should set resumeId", () => {
    useEditorStore.getState().setResumeId("test-id");
    expect(useEditorStore.getState().resumeId).toBe("test-id");
  });

  it("should set content and clear dirty flag", () => {
    useEditorStore.getState().setContent(mockContent);
    const state = useEditorStore.getState();
    expect(state.content).toEqual(mockContent);
    expect(state.isDirty).toBe(false);
  });

  it("should update content and set dirty flag", () => {
    useEditorStore.getState().setContent(mockContent);
    useEditorStore.getState().updateContent({
      personalInfo: { ...mockContent.personalInfo, name: "李四" },
    });

    const state = useEditorStore.getState();
    expect(state.content?.personalInfo.name).toBe("李四");
    expect(state.isDirty).toBe(true);
  });

  it("should not update content if content is null", () => {
    useEditorStore.getState().updateContent({
      personalInfo: { ...mockContent.personalInfo, name: "李四" },
    });
    expect(useEditorStore.getState().content).toBeNull();
  });

  it("should set active section", () => {
    useEditorStore.getState().setActiveSection("education");
    expect(useEditorStore.getState().activeSection).toBe("education");
  });

  it("should set dirty state", () => {
    useEditorStore.getState().setDirty(true);
    expect(useEditorStore.getState().isDirty).toBe(true);
    useEditorStore.getState().setDirty(false);
    expect(useEditorStore.getState().isDirty).toBe(false);
  });

  it("should set saving state", () => {
    useEditorStore.getState().setSaving(true);
    expect(useEditorStore.getState().isSaving).toBe(true);
  });

  it("should set diagnosis result", () => {
    useEditorStore.getState().setDiagnosis(mockDiagnosis);
    expect(useEditorStore.getState().diagnosis).toEqual(mockDiagnosis);
    expect(useEditorStore.getState().diagnosis?.totalScore).toBe(72);
  });

  it("should set diagnosis items", () => {
    const items = [
      {
        id: "1", section: "workExperience", fieldPath: "",
        severity: "critical" as const, category: "quantification",
        originalText: "做了优化", suggestion: "添加数据", isAdopted: false,
      },
    ];
    useEditorStore.getState().setDiagnosisItems(items);
    expect(useEditorStore.getState().diagnosisItems).toHaveLength(1);
  });

  it("should set diagnosing state", () => {
    useEditorStore.getState().setDiagnosing(true);
    expect(useEditorStore.getState().isDiagnosing).toBe(true);
  });

  it("should set rewriting state", () => {
    useEditorStore.getState().setRewriting(true);
    expect(useEditorStore.getState().isRewriting).toBe(true);
  });

  it("should set rewrite target", () => {
    const target = { section: "workExperience", index: 0, field: "highlights" };
    useEditorStore.getState().setRewriteTarget(target);
    expect(useEditorStore.getState().rewriteTarget).toEqual(target);
  });

  it("should reset to initial state", () => {
    useEditorStore.getState().setResumeId("test");
    useEditorStore.getState().setContent(mockContent);
    useEditorStore.getState().setDirty(true);
    useEditorStore.getState().setDiagnosis(mockDiagnosis);

    useEditorStore.getState().reset();

    const state = useEditorStore.getState();
    expect(state.resumeId).toBeNull();
    expect(state.content).toBeNull();
    expect(state.isDirty).toBe(false);
    expect(state.diagnosis).toBeNull();
  });
});
