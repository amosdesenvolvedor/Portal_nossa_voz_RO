import type { UserRole } from "@prisma/client";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

type AdminUser = {
  id: string;
  role: UserRole;
};

const MUTATION_WINDOW_MS = 60_000;
const MUTATION_MAX_PER_WINDOW = 60;

export const ADMIN_MUTATION_ROLES: UserRole[] = ["EDITOR", "ADMIN"];

export function jsonNoStore(payload: unknown, init?: ResponseInit) {
  const response = NextResponse.json(payload, init);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export function unauthenticatedResponse() {
  return jsonNoStore(
    {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "Autenticação obrigatória.",
    },
    { status: 401 },
  );
}

export function forbiddenResponse(message = "Ação não autorizada para o seu papel.") {
  return jsonNoStore(
    {
      ok: false,
      code: "FORBIDDEN",
      message,
    },
    { status: 403 },
  );
}

export function unsupportedMediaTypeResponse() {
  return jsonNoStore(
    {
      ok: false,
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: "Content-Type deve ser application/json.",
    },
    { status: 415 },
  );
}

export function rateLimitedResponse(retryAfterSeconds: number) {
  const response = jsonNoStore(
    {
      ok: false,
      code: "RATE_LIMITED",
      message: "Muitas requisições em sequência. Tente novamente em instantes.",
    },
    { status: 429 },
  );

  response.headers.set("Retry-After", String(retryAfterSeconds));
  return response;
}

function normalizeHost(raw: string | null): string {
  if (!raw) {
    return "";
  }

  return raw.split(",")[0].trim().toLowerCase();
}

function normalizeOriginHost(origin: string | null): string {
  if (!origin) {
    return "";
  }

  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return "";
  }
}

export function isSameOriginRequest(request: Request): boolean {
  const requestHost = normalizeHost(request.headers.get("x-forwarded-host") || request.headers.get("host"));
  const originHost = normalizeOriginHost(request.headers.get("origin"));
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (originHost && requestHost && originHost !== requestHost) {
    return false;
  }

  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site" && secFetchSite !== "none") {
    return false;
  }

  return true;
}

export function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type") || "";
  return contentType.toLowerCase().includes("application/json");
}

export function requireAdminSessionUser(session: Session | null): AdminUser | null {
  if (!session?.user?.id || !session.user.role) {
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
  };
}

export function isAllowedRole(role: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(role);
}

export function enforceMutationRateLimit(userId: string, scope: string) {
  return checkRateLimit(`${scope}:${userId}`, MUTATION_MAX_PER_WINDOW, MUTATION_WINDOW_MS);
}
