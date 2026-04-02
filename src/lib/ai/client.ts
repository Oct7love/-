import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { env } from "@/lib/env";

export const deepseek = createOpenAICompatible({
  name: "deepseek",
  apiKey: env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export const MODELS = {
  chat: "deepseek-chat",
  reasoner: "deepseek-reasoner",
} as const;
