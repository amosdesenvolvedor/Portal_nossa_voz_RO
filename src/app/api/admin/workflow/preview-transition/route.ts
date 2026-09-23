import { authOptions } from "@/lib/auth/options";
import { canTransitionStatus, NEWS_STATUS_LABELS } from "@/lib/auth/policies";
import { NEWS_STATUS } from "@/lib/domain/editorial";
import {
  forbiddenResponse,
  isJsonRequest,
  isSameOriginRequest,
  jsonNoStore,
  requireAdminSessionUser,
  unauthenticatedResponse,
  unsupportedMediaTypeResponse,
} from "@/lib/security/admin-api";
import { getServerSession } from "next-auth";
import { z } from "zod";

const schema = z.object({
  from: z.enum(NEWS_STATUS),
  to: z.enum(NEWS_STATUS),
});

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

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return jsonNoStore(
      {
        ok: false,
        message: "Parâmetros de transição inválidos.",
      },
      { status: 400 },
    );
  }

  const allowed = canTransitionStatus(actor.role, parsed.data.from, parsed.data.to);

  if (!allowed) {
    return jsonNoStore(
      {
        ok: false,
        message: "Seu papel não possui autorização para esta transição editorial.",
      },
      { status: 403 },
    );
  }

  return jsonNoStore({
    ok: true,
    message: `Transição autorizada: ${NEWS_STATUS_LABELS[parsed.data.from]} → ${NEWS_STATUS_LABELS[parsed.data.to]}.`,
    persisted: false,
  });
}
