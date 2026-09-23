import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { createCategory, listCategories } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  isActive: z.boolean().optional(),
});

function unauthenticated() {
  return NextResponse.json(
    {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "Autenticação obrigatória.",
    },
    { status: 401 },
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return unauthenticated();
  }

  const items = await listCategories();
  return NextResponse.json({ ok: true, data: items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return unauthenticated();
  }

  try {
    const payload = createSchema.parse(await request.json());
    const created = await createCategory(payload);
    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
