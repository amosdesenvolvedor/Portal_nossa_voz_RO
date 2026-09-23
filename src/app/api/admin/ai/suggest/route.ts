import { canUseEditorialAi } from "@/lib/auth/policies";
import { authOptions } from "@/lib/auth/options";
import { requestEditorialSuggestion } from "@/lib/ai/editorial";
import { EDITORIAL_AI_TASKS } from "@/lib/ai/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const rateWindowMs = 60_000;
const maxRequestsPerWindow = 6;
const requestTracker = new Map<string, { count: number; resetAt: number }>();

const requestSchema = z.object({
  task: z.enum(EDITORIAL_AI_TASKS),
  input: z.string().min(1).max(8000),
  context: z.string().max(4000).optional(),
});

function isRateLimited(userId: string): boolean {
  const now = Date.now();

  for (const [trackedUserId, entry] of requestTracker) {
    if (now > entry.resetAt) {
      requestTracker.delete(trackedUserId);
    }
  }

  const current = requestTracker.get(userId);

  if (!current || now > current.resetAt) {
    requestTracker.set(userId, {
      count: 1,
      resetAt: now + rateWindowMs,
    });
    return false;
  }

  if (current.count >= maxRequestsPerWindow) {
    return true;
  }

  requestTracker.set(userId, {
    count: current.count + 1,
    resetAt: current.resetAt,
  });

  return false;
}

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

  if (!canUseEditorialAi(session.user.role)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Sem permissão para usar assistência por IA.",
      },
      { status: 403 },
    );
  }

  if (isRateLimited(session.user.id)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Limite temporário de uso da IA atingido. Tente novamente em instantes.",
      },
      { status: 429 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Parâmetros inválidos para assistência editorial.",
      },
      { status: 400 },
    );
  }

  const result = await requestEditorialSuggestion(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: result.error.code,
        message: result.error.message,
      },
      { status: result.error.status ?? 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    suggestion: result.suggestion,
    usageLabel: result.usageLabel,
  });
}
