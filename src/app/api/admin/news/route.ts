import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listAdminNews, createDraftNews } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const result = await listAdminNews(Object.fromEntries(url.searchParams.entries()));

  return NextResponse.json({ ok: true, ...result });
}

export async function POST(request: Request) {
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
    const created = await createDraftNews(payload, {
      id: session.user.id,
      role: session.user.role,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/noticias");
    revalidatePath("/admin/revisao");

    return NextResponse.json({
      ok: true,
      data: created,
    });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
