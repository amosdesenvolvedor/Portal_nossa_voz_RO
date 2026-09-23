import "server-only";
import {
  AI_MAX_OUTPUT_TOKENS,
  AI_PROVIDER_NAME,
  AI_TIMEOUT_MS,
  OPENROUTER_ENDPOINT,
  getAIModel,
  getOpenRouterApiKey,
} from "@/lib/ai/config";
import type { AITextCompletionParams, AITextCompletionResponse, EditorialAIError } from "@/lib/ai/types";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

function createError(code: EditorialAIError["code"], message: string, retryable: boolean, status?: number) {
  return {
    code,
    message,
    provider: AI_PROVIDER_NAME,
    model: getAIModel(),
    retryable,
    status,
  } satisfies EditorialAIError;
}

export async function requestOpenRouterCompletion({
  systemPrompt,
  userPrompt,
}: AITextCompletionParams): Promise<AITextCompletionResponse> {
  const apiKey = getOpenRouterApiKey();
  const model = getAIModel();

  if (!apiKey) {
    return {
      ok: false,
      error: createError("UNCONFIGURED", "OPENROUTER_API_KEY ausente no ambiente do servidor.", false),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: AI_MAX_OUTPUT_TOKENS,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as OpenRouterResponse | null;

    if (response.status === 401) {
      return {
        ok: false,
        error: createError("UNAUTHORIZED", "Nao foi possivel autenticar no provedor configurado.", false, 401),
      };
    }

    if (response.status === 429) {
      return {
        ok: false,
        error: createError("RATE_LIMITED", "Limite temporario do provedor atingido.", true, 429),
      };
    }

    if (response.status >= 500) {
      return {
        ok: false,
        error: createError("PROVIDER_ERROR", "Provedor de IA indisponivel no momento.", true, response.status),
      };
    }

    if (response.status === 404 || response.status === 422) {
      return {
        ok: false,
        error: createError("MODEL_UNAVAILABLE", "Modelo configurado indisponivel no provedor atual.", false, response.status),
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: createError(
          "PROVIDER_ERROR",
          payload?.error?.message || "Falha controlada ao solicitar sugestao editorial.",
          response.status >= 500,
          response.status,
        ),
      };
    }

    const output = payload?.choices?.[0]?.message?.content?.trim();

    if (!output) {
      return {
        ok: false,
        error: createError("INVALID_RESPONSE", "Resposta invalida recebida do provedor de IA.", true, response.status),
      };
    }

    return {
      ok: true,
      output,
      provider: AI_PROVIDER_NAME,
      model,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: createError("TIMEOUT", "Tempo limite excedido ao consultar o provedor de IA.", true),
      };
    }

    return {
      ok: false,
      error: createError("PROVIDER_ERROR", "Falha de comunicacao com o provedor de IA.", true),
    };
  } finally {
    clearTimeout(timeout);
  }
}