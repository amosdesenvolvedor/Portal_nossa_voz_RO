import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
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
import { setMediaAssetBlur, updateMediaAssetMetadata } from "@/lib/media/editorial-media";

const requestSchema = z.object({
  altText: z.string().trim().max(220).optional(),
  caption: z.string().trim().max(220).optional(),
  credit: z.string().trim().max(160).optional(),
  isSensitive: z.boolean().optional(),
  setBlurred: z.boolean().optional(),
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

  if (!isSameOriginRequest(request)) {
    return forbiddenResponse("Origem da requisição não permitida.");
  }

  if (!isJsonRequest(request)) {
    return unsupportedMediaTypeResponse();
  }

  const limit = enforceMutationRateLimit(actor.id, "admin-media-patch");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonNoStore({ ok: false, message: "Parâmetros inválidos." }, { status: 400 });
  }

  try {
    const { id } = await context.params;

    const metadata = await updateMediaAssetMetadata(id, actor, {
      altText: parsed.data.altText,
      caption: parsed.data.caption,
      credit: parsed.data.credit,
      isSensitive: parsed.data.isSensitive,
    });

    let result = metadata;

    if (typeof parsed.data.setBlurred === "boolean") {
      result = await setMediaAssetBlur(id, actor, parsed.data.setBlurred);
    }

    return jsonNoStore({
      ok: true,
      data: {
        id: result.asset.id,
        origin: result.asset.origin,
        mimeType: result.asset.mimeType,
        width: result.asset.width,
        height: result.asset.height,
        fileSize: result.asset.fileSize,
        altText: result.asset.altText,
        caption: result.asset.caption,
        credit: result.asset.credit,
        isSensitive: result.asset.isSensitive,
        isBlurred: result.asset.isBlurred,
        publicUrl: result.publicUrl,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "FORBIDDEN") {
      return forbiddenResponse();
    }
    if (message === "NOT_FOUND") {
      return jsonNoStore({ ok: false, message: "Imagem não encontrada." }, { status: 404 });
    }

    return jsonNoStore({ ok: false, message: "Não foi possível atualizar a imagem." }, { status: 400 });
  }
}
