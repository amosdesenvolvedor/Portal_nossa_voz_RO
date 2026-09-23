import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildNewsHref } from "@/lib/editorial/urls";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import { listPublishedNewsByCategorySlug } from "@/lib/services/editorial-service";

type CategoryPageProps = {
  params: Promise<{
    categoria: string;
  }>;
};

const getPublishedCategoryNews = cache(async (categorySlug: string) => listPublishedNewsByCategorySlug(categorySlug));

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const items = await getPublishedCategoryNews(resolvedParams.categoria);
  const categoryName = items[0]?.category?.name;

  if (!categoryName) {
    return {
      title: "Categoria não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const description = `Notícias publicadas da editoria ${categoryName} no Nossa Voz RO.`;
  const categoryPath = `/noticias/${resolvedParams.categoria}`;

  return {
    title: categoryName,
    description,
    alternates: {
      canonical: absoluteUrl(categoryPath),
    },
    openGraph: {
      type: "website",
      title: categoryName,
      description,
      url: absoluteUrl(categoryPath),
      images: defaultSocialImage(),
    },
    twitter: {
      card: "summary_large_image",
      title: categoryName,
      description,
      images: defaultSocialImage().map((image) => image.url),
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const items = await getPublishedCategoryNews(resolvedParams.categoria);

  if (items.length === 0) {
    notFound();
  }

  const categoryName = items[0]?.category?.name ?? "Notícias";

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Noticias", href: "/noticias" },
            { label: categoryName },
          ]}
        />

        <SectionHeading
          title={categoryName}
          subtitle="Matérias publicadas nesta editoria, ordenadas por publicação mais recente."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
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
