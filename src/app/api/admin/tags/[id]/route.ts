import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { updateTag } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHENTICATED",
        message: "Autenticação obrigatória.",
      },
      { status: 401 },
    );
  }

  try {
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    const updated = await updateTag({ id, ...payload });
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
