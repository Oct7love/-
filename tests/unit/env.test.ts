import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("env validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw if DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    process.env.NEXTAUTH_SECRET = "a-very-long-secret-key-12345";
    process.env.OPENAI_API_KEY = "sk-test";

    await expect(async () => {
      await import("@/lib/env");
    }).rejects.toThrow("Missing or invalid environment variables");
  });

  it("should throw if NEXTAUTH_SECRET is too short", async () => {
    process.env.DATABASE_URL = "postgresql://localhost/test";
    process.env.NEXTAUTH_SECRET = "short";
    process.env.OPENAI_API_KEY = "sk-test";

    await expect(async () => {
      await import("@/lib/env");
    }).rejects.toThrow("Missing or invalid environment variables");
  });

  it("should throw if OPENAI_API_KEY is missing", async () => {
    process.env.DATABASE_URL = "postgresql://localhost/test";
    process.env.NEXTAUTH_SECRET = "a-very-long-secret-key-12345";
    delete process.env.OPENAI_API_KEY;

    await expect(async () => {
      await import("@/lib/env");
    }).rejects.toThrow("Missing or invalid environment variables");
  });

  it("should succeed with all valid env vars", async () => {
    process.env.DATABASE_URL = "postgresql://localhost/test";
    process.env.NEXTAUTH_SECRET = "a-very-long-secret-key-12345";
    process.env.OPENAI_API_KEY = "sk-test-key";

    const { env } = await import("@/lib/env");

    expect(env.DATABASE_URL).toBe("postgresql://localhost/test");
    expect(env.NEXTAUTH_SECRET).toBe("a-very-long-secret-key-12345");
    expect(env.OPENAI_API_KEY).toBe("sk-test-key");
  });
});
