import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getAdminNewsById, updateNewsDraft } from "@/lib/services/editorial-service";
import {
  enforceMutationRateLimit,
  forbiddenResponse,
  isJsonRequest,
  isSameOriginRequest,
  jsonNoStore,
  rateLimitedResponse,
  requireAdminSessionUser,
  unauthenticatedResponse,
  unsupportedMediaTypeResponse,
} from "@/lib/security/admin-api";
import { toApiError } from "@/lib/utils/http-errors";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  const session = await getServerSession(authOptions);
  const actor = requireAdminSessionUser(session);

  if (!actor) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;
  const news = await getAdminNewsById(id, actor);

  if (!news) {
    return jsonNoStore(
      {
        ok: false,
        code: "NOT_FOUND",
        message: "Notícia não encontrada.",
      },
      { status: 404 },
    );
  }

  return jsonNoStore({ ok: true, data: news });
}

export async function PATCH(request: Request, context: Params) {
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

  const limit = enforceMutationRateLimit(actor.id, "admin-news-patch");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = await request.json();
    const { id } = await context.params;

    const updated = await updateNewsDraft(id, payload, {
      id: actor.id,
      role: actor.role,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/noticias");
    revalidatePath(`/admin/noticias/${id}`);
    revalidatePath(`/noticias`);

    return jsonNoStore({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
