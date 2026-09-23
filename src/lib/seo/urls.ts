import { SEO_CONFIG } from "@/lib/seo/config";

export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanedPath, `${SEO_CONFIG.siteUrl}/`).toString();
}
