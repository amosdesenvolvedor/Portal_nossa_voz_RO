import { authOptions } from "@/lib/auth/options";
import { canTransitionStatus, NEWS_STATUS_LABELS } from "@/lib/auth/policies";
import { NEWS_STATUS } from "@/lib/domain/editorial";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  from: z.enum(NEWS_STATUS),
  to: z.enum(NEWS_STATUS),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json(
      {
        ok: false,
        message: "Autenticação obrigatória.",
      },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Parâmetros de transição inválidos.",
      },
      { status: 400 },
    );
  }

  const allowed = canTransitionStatus(session.user.role, parsed.data.from, parsed.data.to);

  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Seu papel não possui autorização para esta transição editorial.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Transição autorizada: ${NEWS_STATUS_LABELS[parsed.data.from]} → ${NEWS_STATUS_LABELS[parsed.data.to]}.`,
    persisted: false,
  });
}
