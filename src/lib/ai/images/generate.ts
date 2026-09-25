import { getAiImageProviderStatus } from "@/lib/ai/images/provider";
import { isBlockedEditorialImagePrompt } from "@/lib/ai/images/moderation";
import type { AiImageGenerationRequest, AiImageGenerationResult } from "@/lib/ai/images/types";

export async function generateEditorialIllustration(request: AiImageGenerationRequest): Promise<AiImageGenerationResult> {
  const prompt = request.prompt.trim();

  if (!prompt) {
    return {
      ok: false,
      code: "INVALID_PROMPT",
      message: "Descrição da ilustração vazia.",
    };
  }

  if (isBlockedEditorialImagePrompt(prompt)) {
    return {
      ok: false,
      code: "POLICY_BLOCKED",
      message: "Não foi possível gerar esta imagem. Para cobertura factual, utilize fotografia real ou ilustração não enganosa.",
    };
  }

  const status = getAiImageProviderStatus();

  if (!status.available) {
    return {
      ok: false,
      code: "UNAVAILABLE",
      message: "Geração visual por IA indisponível no ambiente atual.",
    };
  }

  return {
    ok: false,
    code: "UNAVAILABLE",
    message: "Geração visual por IA indisponível no ambiente atual.",
  };
}
