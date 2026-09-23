import { SITE_CONFIG } from "@/config/site";

const DEFAULT_DEV_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value?: string): string {
  const raw = value?.trim();

  if (!raw) {
    return DEFAULT_DEV_SITE_URL;
  }

  try {
    const parsed = new URL(raw);
    const normalizedPath = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${normalizedPath}`;
  } catch {
    return DEFAULT_DEV_SITE_URL;
  }
}

export const SEO_CONFIG = {
  siteName: SITE_CONFIG.name,
  siteSlogan: SITE_CONFIG.slogan,
  siteDescription:
    "Notícias e informação regional de Rondônia, com cobertura das comunidades e municípios.",
  siteLocale: "pt_BR",
  siteLanguage: "pt-BR",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL),
  socialImage: {
    path: "/brand/nossa-voz-ro-social.svg",
    width: 1200,
    height: 630,
    alt: "Nossa Voz RO — A Voz de Quem Vive Aqui",
  },
} as const;

export const SEO_ALLOW_INDEXING =
  process.env.SEO_ALLOW_INDEXING === "true" ||
  (process.env.NODE_ENV === "production" && process.env.SEO_ALLOW_INDEXING !== "false");
