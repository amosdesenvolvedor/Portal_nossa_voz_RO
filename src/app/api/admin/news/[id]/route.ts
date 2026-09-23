import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getAdminNewsById, updateNewsDraft } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
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

  const { id } = await context.params;
  const news = await getAdminNewsById(id);

  if (!news) {
    return NextResponse.json(
      {
        ok: false,
        code: "NOT_FOUND",
        message: "Notícia não encontrada.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data: news });
}

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
    const payload = await request.json();
    const { id } = await context.params;

    const updated = await updateNewsDraft(id, payload, {
      id: session.user.id,
      role: session.user.role,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/noticias");
    revalidatePath(`/admin/noticias/${id}`);
    revalidatePath(`/noticias`);

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
