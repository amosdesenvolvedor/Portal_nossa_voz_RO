import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { createAuthorProfile, listAuthors } from "@/lib/services/editorial-service";
import { toApiError } from "@/lib/utils/http-errors";

const createSchema = z.object({
  userId: z.string().trim().min(1),
  displayName: z.string().trim().min(2).max(120),
  publicSlug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  bio: z.string().trim().max(2000).optional(),
  avatarUrl: z.string().trim().url().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
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
    const data = await listAuthors();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
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
    const payload = createSchema.parse(await request.json());
    const created = await createAuthorProfile(payload);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    const handled = toApiError(error);
    return NextResponse.json(handled.payload, { status: handled.status });
  }
}
