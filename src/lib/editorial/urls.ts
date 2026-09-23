import { toUrlSlug } from "@/config/site";

export function buildNewsHref(category: string, slug: string): string {
  return `/noticias/${toUrlSlug(category)}/${slug}`;
}

export function buildCategoryHref(category: string): string {
  return `/noticias/${toUrlSlug(category)}`;
}