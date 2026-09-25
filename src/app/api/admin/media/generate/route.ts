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
import { createMediaAssetFromUpload } from "@/lib/media/editorial-media";
import { generateEditorialIllustration } from "@/lib/ai/images/generate";
import { getAiImageProviderStatus } from "@/lib/ai/images/provider";

const requestSchema = z.object({
  prompt: z.string().trim().min(4).max(400),
  context: z.string().trim().max(4000).optional(),
});

export async function GET() {
  const status = getAiImageProviderStatus();

  return jsonNoStore({
    ok: true,
    provider: status.provider,
    model: status.model,
    available: status.available,
  });
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

  const limit = enforceMutationRateLimit(actor.id, "admin-media-generate");
  if (!limit.allowed) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonNoStore({ ok: false, message: "Descrição da ilustração inválida." }, { status: 400 });
  }

  const generated = await generateEditorialIllustration(parsed.data);

  if (!generated.ok) {
    const status = generated.code === "UNAVAILABLE" ? 503 : 400;
    return jsonNoStore({ ok: false, code: generated.code, message: generated.message }, { status });
  }

  try {
    const created = await createMediaAssetFromUpload({
      actor,
      buffer: generated.buffer,
      origin: "AI_GENERATED",
      caption: "Ilustração gerada por inteligência artificial.",
      credit: "Assistência Editorial IA",
      aiPrompt: parsed.data.prompt,
    });

    return jsonNoStore({
      ok: true,
      data: {
        id: created.asset.id,
        origin: created.asset.origin,
        mimeType: created.asset.mimeType,
        width: created.asset.width,
        height: created.asset.height,
        fileSize: created.asset.fileSize,
        altText: created.asset.altText,
        caption: created.asset.caption,
        credit: created.asset.credit,
        isSensitive: created.asset.isSensitive,
        isBlurred: created.asset.isBlurred,
        publicUrl: created.publicUrl,
      },
    });
  } catch {
    return jsonNoStore({ ok: false, message: "Não foi possível gerar a imagem agora." }, { status: 400 });
  }
}
