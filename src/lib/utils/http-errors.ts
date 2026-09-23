export type ApiErrorPayload = {
  ok: false;
  code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "CONFLICT" | "INTERNAL_ERROR";
  message: string;
};

export function toApiError(error: unknown): { status: number; payload: ApiErrorPayload } {
  const rawMessage = error instanceof Error ? error.message : "INTERNAL_ERROR";

  if (rawMessage === "FORBIDDEN") {
    return {
      status: 403,
      payload: { ok: false, code: "FORBIDDEN", message: "Ação não autorizada para o seu papel." },
    };
  }

  if (rawMessage === "NOT_FOUND") {
    return {
      status: 404,
      payload: { ok: false, code: "NOT_FOUND", message: "Recurso editorial não encontrado." },
    };
  }

  if (rawMessage === "CONFLICT") {
    return {
      status: 409,
      payload: { ok: false, code: "CONFLICT", message: "Conflito de atualização: recarregue o conteúdo e tente novamente." },
    };
  }

  if (rawMessage.startsWith("VALIDATION_ERROR")) {
    return {
      status: 400,
      payload: { ok: false, code: "VALIDATION_ERROR", message: rawMessage.replace("VALIDATION_ERROR:", "").trim() || "Payload editorial inválido." },
    };
  }

  return {
    status: 500,
    payload: { ok: false, code: "INTERNAL_ERROR", message: "Falha interna ao processar operação editorial." },
  };
}
