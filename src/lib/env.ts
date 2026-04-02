import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET must be at least 16 characters"),
  NEXTAUTH_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    const missing = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
      .join("\n");
    throw new Error(`Missing or invalid environment variables:\n${missing}`);
  }
  return result.data;
}

export const env = validateEnv();
