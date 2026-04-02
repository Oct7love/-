import { describe, it, expect } from "vitest";
import {
  RESUME_SCORER_SYSTEM_PROMPT,
  RESUME_SCORER_USER_PROMPT,
} from "@/lib/ai/prompts/resume-scorer";

describe("AI Prompts", () => {
  describe("resume-scorer", () => {
    it("should have a system prompt with 5 dimensions", () => {
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("内容完整性");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("描述质量");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("关键词覆盖");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("排版规范");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("整体印象");
    });

    it("should have correct scoring totals", () => {
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("满分20分");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("满分30分");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("满分15分");
    });

    it("should require JSON output format", () => {
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("totalScore");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("dimensions");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("items");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("overallSummary");
    });

    it("should specify severity levels", () => {
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("critical");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("warning");
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("info");
    });

    it("should require Chinese output", () => {
      expect(RESUME_SCORER_SYSTEM_PROMPT).toContain("用中文输出所有内容");
    });

    it("should generate user prompt with resume content", () => {
      const resumeJson = '{"personalInfo":{"name":"张三"}}';
      const prompt = RESUME_SCORER_USER_PROMPT(resumeJson);
      expect(prompt).toContain(resumeJson);
      expect(prompt).toContain("诊断评分");
    });
  });
});
