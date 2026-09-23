import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/db/prisma";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Autores",
  description: "Perfis públicos de autoria do Nossa Voz RO com matérias publicadas.",
  alternates: {
    canonical: absoluteUrl("/autores"),
  },
  openGraph: {
    type: "website",
    title: "Autores",
    description: "Perfis públicos de autoria do Nossa Voz RO com matérias publicadas.",
    url: absoluteUrl("/autores"),
    images: defaultSocialImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Autores",
    description: "Perfis públicos de autoria do Nossa Voz RO com matérias publicadas.",
    images: defaultSocialImage().map((image) => image.url),
  },
};

export default async function AutoresPage() {
  const [authors, grouped] = await Promise.all([
    prisma.user.findMany({
      where: { isAuthorProfileActive: true, publicSlug: { not: null } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, publicSlug: true, bio: true },
    }),
    prisma.news.groupBy({
      by: ["authorId"],
      where: { status: "PUBLISHED", authorId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const publishedByAuthor = new Map(grouped.map((entry) => [entry.authorId ?? "", entry._count._all]));

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <SectionHeading
          title="Autores"
          subtitle="Perfis públicos ativos para navegação por assinatura editorial."
        />

        <ul className="grid gap-3 md:grid-cols-2">
          {authors.map((author) => (
            <li key={author.id} className="surface-card p-4">
              <h2 className="text-h4">
                <Link href={`/autores/${author.publicSlug}`} className="inline-flex">
                  {author.name}
                </Link>
              </h2>
              <p className="mt-1 text-caption text-text-muted">{publishedByAuthor.get(author.id) ?? 0} matérias publicadas</p>
              {author.bio ? <p className="mt-3 text-body-sm text-text-muted">{author.bio}</p> : null}
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
