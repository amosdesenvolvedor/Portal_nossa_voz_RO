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

type MunicipalityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getPublicMunicipalityPageData = cache(async (slug: string) =>
  prisma.municipality.findUnique({
    where: { slug },
    include: {
      region: true,
      news: {
        where: { status: "PUBLISHED" },
        include: { category: true, municipality: true },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      },
    },
  }),
);

export async function generateMetadata({ params }: MunicipalityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const municipality = await getPublicMunicipalityPageData(resolvedParams.slug);

  if (!municipality || !municipality.isActive) {
    return {
      title: "Município não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title = `Notícias de ${municipality.name}`;
  const description = truncateDescription(
    `Cobertura pública do município de ${municipality.name}${municipality.region?.name ? `, região ${municipality.region.name}` : ""}.`,
  );
  const path = `/municipios/${municipality.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
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

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const resolvedParams = await params;
  const municipality = await getPublicMunicipalityPageData(resolvedParams.slug);

  if (!municipality || !municipality.isActive) {
    notFound();
  }

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Municipios", href: "/municipios" },
            { label: municipality.name },
          ]}
        />

        <SectionHeading
          title={municipality.name}
          subtitle={`Região: ${municipality.region?.name ?? "Rondônia"}`}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {municipality.news.map((item) => (
            <NewsCard
              key={item.id}
              href={buildNewsHref(item.category?.name ?? "noticias", item.slug)}
              title={item.title}
              summary={item.summary ?? "Sem resumo"}
              category={item.category?.name ?? "Notícias"}
              municipality={municipality.name}
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
