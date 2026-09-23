import { canUseEditorialAi } from "@/lib/auth/policies";
import { authOptions } from "@/lib/auth/options";
import { requestEditorialSuggestion } from "@/lib/ai/editorial";
import { EDITORIAL_AI_TASKS } from "@/lib/ai/types";
import {
  forbiddenResponse,
  isJsonRequest,
  isSameOriginRequest,
  jsonNoStore,
  rateLimitedResponse,
  requireAdminSessionUser,
  unauthenticatedResponse,
  unsupportedMediaTypeResponse,
} from "@/lib/security/admin-api";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getServerSession } from "next-auth";
import { z } from "zod";

const rateWindowMs = 60_000;
const maxRequestsPerWindow = 6;

const requestSchema = z.object({
  task: z.enum(EDITORIAL_AI_TASKS),
  input: z.string().min(1).max(8000),
  context: z.string().max(4000).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);

  if (!actor) {
    return unauthenticatedResponse();
  }

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  if (!canUseEditorialAi(actor.role)) {
    return jsonNoStore(
      {
        ok: false,
        message: "Sem permissão para usar assistência por IA.",
      },
      { status: 403 },
    );
  }

  const limit = checkRateLimit(`admin-ai:${actor.id}`, maxRequestsPerWindow, rateWindowMs);
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonNoStore(
      {
        ok: false,
        message: "Parâmetros inválidos para assistência editorial.",
      },
      { status: 400 },
    );
  }

  const result = await requestEditorialSuggestion(parsed.data);

  if (!result.ok) {
    return jsonNoStore(
      {
        ok: false,
        code: result.error.code,
        message: result.error.message,
      },
      { status: result.error.status ?? 400 },
    );
  }

  return jsonNoStore({
    ok: true,
    suggestion: result.suggestion,
    usageLabel: result.usageLabel,
  });
}
