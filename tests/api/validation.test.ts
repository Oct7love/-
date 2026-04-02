import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少 8 个字符")
    .regex(/[A-Z]/, "密码需包含至少一个大写字母")
    .regex(/[a-z]/, "密码需包含至少一个小写字母")
    .regex(/[0-9]/, "密码需包含至少一个数字"),
  name: z.string().min(1, "请输入昵称").max(50, "昵称不超过 50 个字符"),
});

const createResumeSchema = z.object({
  title: z.string().min(1).max(200).default("未命名简历"),
  language: z.string().default("zh-CN"),
  sourceType: z.enum(["upload", "manual", "template"]).default("manual"),
  templateId: z.string().uuid().optional(),
});

const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(["draft", "completed", "archived"]).optional(),
    templateId: z.string().uuid().nullable().optional(),
    templateConfig: z.record(z.string(), z.unknown()).optional(),
  lastScore: z.number().int().min(0).max(100).optional(),
  lastDiagnosedAt: z.coerce.date().optional(),
});

describe("API validation schemas", () => {
  describe("register schema", () => {
    it("should accept valid input", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "Password1",
        name: "张三",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = registerSchema.safeParse({
        email: "not-an-email",
        password: "Password1",
        name: "张三",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "Pass1",
        name: "张三",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "password1",
        name: "张三",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without lowercase", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "PASSWORD1",
        name: "张三",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "Passwords",
        name: "张三",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "Password1",
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject name longer than 50 chars", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "Password1",
        name: "a".repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("create resume schema", () => {
    it("should accept minimal input with defaults", () => {
      const result = createResumeSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("未命名简历");
        expect(result.data.language).toBe("zh-CN");
        expect(result.data.sourceType).toBe("manual");
      }
    });

    it("should accept full input", () => {
      const result = createResumeSchema.safeParse({
        title: "前端简历",
        language: "en-US",
        sourceType: "upload",
        templateId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid sourceType", () => {
      const result = createResumeSchema.safeParse({
        sourceType: "invalid",
      });
      expect(result.success).toBe(false);
    });

    it("should reject title longer than 200 chars", () => {
      const result = createResumeSchema.safeParse({
        title: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid templateId format", () => {
      const result = createResumeSchema.safeParse({
        templateId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("update resume schema", () => {
    it("should accept empty object (all optional)", () => {
      const result = updateResumeSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should accept valid partial update", () => {
      const result = updateResumeSchema.safeParse({
        title: "新标题",
        status: "completed",
      });
      expect(result.success).toBe(true);
    });

    it("should accept partial update without content", () => {
      const result = updateResumeSchema.safeParse({
        title: "新标题",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBeUndefined();
      }
    });

    it("should reject invalid status", () => {
      const result = updateResumeSchema.safeParse({
        status: "invalid",
      });
      expect(result.success).toBe(false);
    });

    it("should reject score out of range", () => {
      expect(updateResumeSchema.safeParse({ lastScore: -1 }).success).toBe(false);
      expect(updateResumeSchema.safeParse({ lastScore: 101 }).success).toBe(false);
      expect(updateResumeSchema.safeParse({ lastScore: 50 }).success).toBe(true);
    });

    it("should block userId injection", () => {
      const result = updateResumeSchema.safeParse({
        userId: "malicious-id",
        title: "正常标题",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect("userId" in result.data).toBe(false);
      }
    });

    it("should block deletedAt injection", () => {
      const result = updateResumeSchema.safeParse({
        deletedAt: null,
        title: "正常标题",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect("deletedAt" in result.data).toBe(false);
      }
    });

    it("should block createdAt injection", () => {
      const result = updateResumeSchema.safeParse({
        createdAt: "2020-01-01",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect("createdAt" in result.data).toBe(false);
      }
    });

    it("should accept nullable templateId", () => {
      const result = updateResumeSchema.safeParse({
        templateId: null,
      });
      expect(result.success).toBe(true);
    });

    it("should coerce date string to Date", () => {
      const result = updateResumeSchema.safeParse({
        lastDiagnosedAt: "2024-01-15T08:00:00Z",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lastDiagnosedAt).toBeInstanceOf(Date);
      }
    });
  });
});
