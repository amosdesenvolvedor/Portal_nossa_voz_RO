import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { ADMIN_MUTATION_ROLES } from "@/lib/security/admin-api";
import { isSafeHttpUrl } from "@/lib/security/url";
import { updateAuthorProfile } from "@/lib/services/editorial-service";
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
  name: z.string().trim().min(2).max(120),
  publicSlug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  bio: z.string().trim().max(2000).optional(),
  avatarUrl: z
    .string()
    .trim()
    .refine((value) => isSafeHttpUrl(value), "URL de avatar inválida ou insegura.")
    .optional(),
  isAuthorProfileActive: z.boolean(),
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
    return forbiddenResponse("Apenas editores e administradores podem editar perfis de autoria.");
  }

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  const limit = enforceMutationRateLimit(actor.id, "admin-authors-patch");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    const updated = await updateAuthorProfile({ id, ...payload });
    return jsonNoStore({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
