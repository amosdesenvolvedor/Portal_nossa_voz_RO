import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { updateAuthorProfile } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  publicSlug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  bio: z.string().trim().max(2000).optional(),
  avatarUrl: z.string().trim().url().optional(),
  isAuthorProfileActive: z.boolean(),
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
    const updated = await updateAuthorProfile({ id, ...payload });
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
