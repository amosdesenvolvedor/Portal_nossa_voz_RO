import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { absoluteUrl } from "@/lib/seo/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latestPublished, categories, municipalities, authors, news] = await Promise.all([
    prisma.news.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        news: {
          some: { status: "PUBLISHED" },
        },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { name: "asc" },
    }),
    prisma.municipality.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: {
        isAuthorProfileActive: true,
        publicSlug: { not: null },
      },
      select: { publicSlug: true, updatedAt: true },
      orderBy: { name: "asc" },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  const staticLastMod = latestPublished?.updatedAt;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: staticLastMod },
    { url: absoluteUrl("/noticias"), lastModified: staticLastMod },
    { url: absoluteUrl("/municipios"), lastModified: staticLastMod },
    { url: absoluteUrl("/autores"), lastModified: staticLastMod },
    { url: absoluteUrl("/sobre") },
    { url: absoluteUrl("/contato") },
    { url: absoluteUrl("/publicidade") },
    { url: absoluteUrl("/politica-de-privacidade") },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/noticias/${category.slug}`),
    lastModified: category.updatedAt,
  }));

  const municipalityRoutes: MetadataRoute.Sitemap = municipalities.map((municipality) => ({
    url: absoluteUrl(`/municipios/${municipality.slug}`),
    lastModified: municipality.updatedAt,
  }));

  const authorRoutes: MetadataRoute.Sitemap = authors
    .filter((author) => Boolean(author.publicSlug))
    .map((author) => ({
      url: absoluteUrl(`/autores/${author.publicSlug}`),
      lastModified: author.updatedAt,
    }));

  const articleRoutes: MetadataRoute.Sitemap = news
    .filter((item) => Boolean(item.category?.slug))
    .map((item) => ({
      url: absoluteUrl(`/noticias/${item.category?.slug}/${item.slug}`),
      lastModified: item.updatedAt,
    }));

  return [...staticRoutes, ...categoryRoutes, ...municipalityRoutes, ...authorRoutes, ...articleRoutes];
}
