import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const deepseek = createOpenAICompatible({
  name: "deepseek",
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export const MODELS = {
  chat: "deepseek-chat",
  reasoner: "deepseek-reasoner",
} as const;
