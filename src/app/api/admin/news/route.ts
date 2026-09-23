import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listAdminNews, createDraftNews } from "@/lib/services/editorial-service";
import {
  enforceMutationRateLimit,
  isJsonRequest,
  isSameOriginRequest,
  jsonNoStore,
  requireAdminSessionUser,
  unauthenticatedResponse,
  unsupportedMediaTypeResponse,
  rateLimitedResponse,
  forbiddenResponse,
} from "@/lib/security/admin-api";
import { toApiError } from "@/lib/utils/http-errors";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);

  if (!actor) {
    return unauthenticatedResponse();
  }

  const url = new URL(request.url);
  const result = await listAdminNews(Object.fromEntries(url.searchParams.entries()), actor);

  return jsonNoStore({ ok: true, ...result });
}

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

  const limit = enforceMutationRateLimit(actor.id, "admin-news-post");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = await request.json();
    const created = await createDraftNews(payload, {
      id: actor.id,
      role: actor.role,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/noticias");
    revalidatePath("/admin/revisao");

    return jsonNoStore({
      ok: true,
      data: created,
    });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
