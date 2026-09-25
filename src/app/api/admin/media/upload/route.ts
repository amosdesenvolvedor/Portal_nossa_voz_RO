import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import {
  enforceMutationRateLimit,
  forbiddenResponse,
  isSameOriginRequest,
  jsonNoStore,
  rateLimitedResponse,
  requireAdminSessionUser,
  unauthenticatedResponse,
} from "@/lib/security/admin-api";
import { createMediaAssetFromUpload, MEDIA_MAX_FILE_SIZE_BYTES } from "@/lib/media/editorial-media";

const metadataSchema = z.object({
  altText: z.string().trim().max(220).optional(),
  caption: z.string().trim().max(220).optional(),
  credit: z.string().trim().max(160).optional(),
});

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return !!value && typeof value !== "string" && typeof value.arrayBuffer === "function";
}

function mapUploadError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const normalized = message.toUpperCase();

  if (normalized === "IMAGE_SIZE_EXCEEDED") {
    return { status: 413, message: "Esta imagem é muito grande." };
  }

  if (
    normalized === "UNSUPPORTED_IMAGE_FORMAT" ||
    normalized.includes("UNSUPPORTED IMAGE FORMAT") ||
    normalized.includes("INVALID_IMAGE") ||
    normalized.includes("INVALID IMAGE")
  ) {
    return { status: 415, message: "Formato de imagem não suportado. Use JPEG, PNG ou WebP." };
  }

  if (normalized === "IMAGE_DIMENSIONS_EXCEEDED" || normalized === "IMAGE_PIXELS_EXCEEDED") {
    return { status: 400, message: "Resolução da imagem excede o limite permitido." };
  }

  if (normalized === "INVALID_IMAGE") {
    return { status: 400, message: "Arquivo de imagem inválido." };
  }

  return { status: 400, message: "Não foi possível enviar a foto." };
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

  const limit = enforceMutationRateLimit(actor.id, "admin-media-upload");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : null;
  if (Number.isFinite(contentLength) && contentLength && contentLength > MEDIA_MAX_FILE_SIZE_BYTES + 1_000_000) {
    return jsonNoStore({ ok: false, message: "Esta imagem é muito grande." }, { status: 413 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return jsonNoStore({ ok: false, message: "Não foi possível ler o upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!isUploadedFile(file)) {
    return jsonNoStore({ ok: false, message: "Selecione uma imagem para continuar." }, { status: 400 });
  }

  if (file.size <= 0) {
    return jsonNoStore({ ok: false, message: "Arquivo vazio." }, { status: 400 });
  }

  if (file.size > MEDIA_MAX_FILE_SIZE_BYTES) {
    return jsonNoStore({ ok: false, message: "Esta imagem é muito grande." }, { status: 413 });
  }

  const metadata = metadataSchema.safeParse({
    altText: formData.get("altText")?.toString(),
    caption: formData.get("caption")?.toString(),
    credit: formData.get("credit")?.toString(),
  });

  if (!metadata.success) {
    return jsonNoStore({ ok: false, message: "Metadados da imagem inválidos." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await createMediaAssetFromUpload({
      actor,
      buffer,
      origin: "UPLOADED",
      ...metadata.data,
    });

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
    const mapped = mapUploadError(error);
    return jsonNoStore({ ok: false, message: mapped.message }, { status: mapped.status });
  }
}
