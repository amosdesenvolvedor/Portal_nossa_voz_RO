import "server-only";
import type { AIProviderName } from "@/lib/ai/types";

const OPENROUTER_DEFAULT_MODEL = "openrouter/free";

export const AI_PROVIDER_NAME: AIProviderName = "openrouter";
export const AI_TIMEOUT_MS = 12000;
export const AI_MAX_INPUT_CHARS = 8000;
export const AI_MAX_CONTEXT_CHARS = 4000;
export const AI_MAX_OUTPUT_TOKENS = 500;
export const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function getAIModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || OPENROUTER_DEFAULT_MODEL;
}

export function getOpenRouterApiKey(): string | null {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  return apiKey ? apiKey : null;
}

export function isAIConfigured(): boolean {
  return Boolean(getOpenRouterApiKey());
}