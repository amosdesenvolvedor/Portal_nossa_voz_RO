import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/db/prisma";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildNewsHref } from "@/lib/editorial/urls";
import { defaultSocialImage, truncateDescription } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getPublicAuthorPageData = cache(async (slug: string) =>
  prisma.user.findFirst({
    where: { publicSlug: slug, isAuthorProfileActive: true },
    include: {
      assignedAuthoredNews: {
        where: { status: "PUBLISHED" },
        include: { category: true, municipality: true },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      },
    },
  }),
);

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const author = await getPublicAuthorPageData(resolvedParams.slug);

  if (!author) {
    return {
      title: "Autor não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const path = `/autores/${resolvedParams.slug}`;
  const title = author.name;
  const description = truncateDescription(author.bio || `Perfil público de ${author.name} no Nossa Voz RO.`);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: absoluteUrl(path),
      images: defaultSocialImage(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: defaultSocialImage().map((image) => image.url),
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const author = await getPublicAuthorPageData(resolvedParams.slug);

  if (!author) {
    notFound();
  }

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Autores", href: "/autores" },
            { label: author.name },
          ]}
        />

        <SectionHeading title={author.name} subtitle={author.bio ?? "Perfil editorial"} />

        <div className="grid gap-4 lg:grid-cols-2">
          {author.assignedAuthoredNews.map((item) => (
            <NewsCard
              key={item.id}
              href={buildNewsHref(item.category?.name ?? "noticias", item.slug)}
              title={item.title}
              summary={item.summary ?? "Sem resumo"}
              category={item.category?.name ?? "Notícias"}
              municipality={item.municipality?.name ?? "Rondônia"}
              publishedAt={formatEditorialDateTimeLabel(item.publishedAt ?? item.updatedAt)}
              publishedAtISO={item.publishedAt?.toISOString()}
              imageSrc={item.heroImageUrl ?? undefined}
              imageAlt={item.heroImageAlt ?? undefined}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
