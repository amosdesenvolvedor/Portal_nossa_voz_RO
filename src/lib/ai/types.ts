export const EDITORIAL_AI_TASKS = [
  "headline",
  "subheadline",
  "summary",
  "proofread",
  "clarity",
  "tags",
  "draft",
] as const;

export type AIProviderName = "openrouter";
export type EditorialAITask = (typeof EDITORIAL_AI_TASKS)[number];

export type EditorialAIRequest = {
  task: EditorialAITask;
  input: string;
  context?: string;
  locale?: string;
};

export type EditorialAIErrorCode =
  | "UNCONFIGURED"
  | "INVALID_INPUT"
  | "INPUT_TOO_LARGE"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  | "MODEL_UNAVAILABLE"
  | "INVALID_RESPONSE"
  | "PROVIDER_ERROR";

export type EditorialAIError = {
  code: EditorialAIErrorCode;
  message: string;
  provider: AIProviderName;
  model?: string;
  retryable: boolean;
  status?: number;
};

export type EditorialAISuccess = {
  ok: true;
  provider: AIProviderName;
  model: string;
  suggestion: string;
  usageLabel: "SUGESTAO_EDITORIAL";
};

export type EditorialAIFailure = {
  ok: false;
  error: EditorialAIError;
};

export type EditorialAIResult = EditorialAISuccess | EditorialAIFailure;

export type AITextCompletionParams = {
  systemPrompt: string;
  userPrompt: string;
};

export type AITextCompletionResult = {
  ok: true;
  output: string;
  provider: AIProviderName;
  model: string;
};

export type AITextCompletionFailure = {
  ok: false;
  error: EditorialAIError;
};

export type AITextCompletionResponse = AITextCompletionResult | AITextCompletionFailure;