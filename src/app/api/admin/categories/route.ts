import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { ADMIN_MUTATION_ROLES } from "@/lib/security/admin-api";
import { createCategory, listCategories } from "@/lib/services/editorial-service";
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

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  isActive: z.boolean().optional(),
});

function unauthenticated() {
  return unauthenticatedResponse();
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);
  if (!actor) {
    return unauthenticated();
  }

  const items = await listCategories();
  return jsonNoStore({ ok: true, data: items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);

  if (!actor) {
    return unauthenticated();
  }

  if (!isAllowedRole(actor.role, ADMIN_MUTATION_ROLES)) {
    return forbiddenResponse("Apenas editores e administradores podem criar categorias.");
  }

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  const limit = enforceMutationRateLimit(actor.id, "admin-categories-post");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = createSchema.parse(await request.json());
    const created = await createCategory(payload);
    return jsonNoStore({ ok: true, data: created });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
