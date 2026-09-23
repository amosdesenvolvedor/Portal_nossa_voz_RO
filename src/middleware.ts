import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getMissingRequiredProductionEnv } from "@/lib/security/env";

function buildCsp(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const host = request.headers.get("host") || "localhost";
  const wsHost = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? ` ws://${host} wss://${host}` : "";

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${isDevelopment ? wsHost : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ];

  if (!isDevelopment) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function applySecurityHeaders(request: NextRequest, response: NextResponse) {
  response.headers.set("Content-Security-Policy", buildCsp(request));
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttpsRequest = forwardedProto === "https" || request.nextUrl.protocol === "https:";

  if (process.env.NODE_ENV === "production" && isHttpsRequest) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const missingEnv = getMissingRequiredProductionEnv();
  if (missingEnv.length > 0) {
    console.error("Critical production env missing:", missingEnv.join(","));
    return applySecurityHeaders(
      request,
      new NextResponse("Serviço temporariamente indisponível.", {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }),
    );
  }

  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return applySecurityHeaders(request, NextResponse.next());
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (pathname === "/admin/login") {
    if (token) {
      return applySecurityHeaders(request, NextResponse.redirect(new URL("/admin", request.url)));
    }

    return applySecurityHeaders(request, NextResponse.next());
  }

  if (!token || typeof token.sub !== "string" || typeof token.role !== "string") {
    return applySecurityHeaders(request, NextResponse.redirect(new URL("/admin/login", request.url)));
  }

  return applySecurityHeaders(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
