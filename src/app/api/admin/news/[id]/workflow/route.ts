import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { transitionNewsWorkflow } from "@/lib/services/editorial-service";
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

export async function POST(request: Request, context: Params) {
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

  const limit = enforceMutationRateLimit(actor.id, "admin-news-workflow");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  try {
    const payload = await request.json();
    const { id } = await context.params;

    const updated = await transitionNewsWorkflow(id, payload, {
      id: actor.id,
      role: actor.role,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/noticias");
    revalidatePath("/admin/revisao");
    revalidatePath(`/admin/noticias/${id}`);
    revalidatePath(`/noticias`);

    return jsonNoStore({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return jsonNoStore(handled.payload, { status: handled.status });
  }
}
