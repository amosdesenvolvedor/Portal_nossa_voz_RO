import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { ADMIN_MUTATION_ROLES } from "@/lib/security/admin-api";
import { updateCategory } from "@/lib/services/editorial-service";
import {
  enforceMutationRateLimit,
  forbiddenResponse,
  isAllowedRole,
  isJsonRequest,
  isSameOriginRequest,
  jsonNoStore,
  rateLimitedResponse,
  requireAdminSessionUser,
  unauthenticatedResponse,
  unsupportedMediaTypeResponse,
} from "@/lib/security/admin-api";
import { toApiError } from "@/lib/utils/http-errors";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  isActive: z.boolean(),
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Params) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);
  if (!actor) {
    return unauthenticatedResponse();
  }

  if (!isAllowedRole(actor.role, ADMIN_MUTATION_ROLES)) {
    return forbiddenResponse("Apenas editores e administradores podem editar categorias.");
  }

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  const limit = enforceMutationRateLimit(actor.id, "admin-categories-patch");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    const updated = await updateCategory({ id, ...payload });
    return jsonNoStore({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
