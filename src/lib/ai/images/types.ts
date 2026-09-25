export type AiImageProviderName = "none";

export type AiImageGenerationRequest = {
  prompt: string;
  context?: string;
};

export type AiImageGenerationSuccess = {
  ok: true;
  mimeType: "image/png";
  buffer: Buffer;
  provider: AiImageProviderName;
  model: string;
};

export type AiImageGenerationFailure = {
  ok: false;
  code: "UNAVAILABLE" | "POLICY_BLOCKED" | "INVALID_PROMPT";
  message: string;
};

export type AiImageGenerationResult = AiImageGenerationSuccess | AiImageGenerationFailure;
