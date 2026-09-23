import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { ADMIN_MUTATION_ROLES } from "@/lib/security/admin-api";
import { createTag, listTags } from "@/lib/services/editorial-service";
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
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);
  if (!actor) {
    return unauthenticatedResponse();
  }

  try {
    const data = await listTags();
    return jsonNoStore({ ok: true, data });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);
  if (!actor) {
    return unauthenticatedResponse();
  }

  if (!isAllowedRole(actor.role, ADMIN_MUTATION_ROLES)) {
    return forbiddenResponse("Apenas editores e administradores podem criar tags.");
  }

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  const limit = enforceMutationRateLimit(actor.id, "admin-tags-post");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = createSchema.parse(await request.json());
    const created = await createTag(payload);
    return jsonNoStore({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
