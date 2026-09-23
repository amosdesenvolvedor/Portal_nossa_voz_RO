import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildCategoryHref, buildNewsHref } from "@/lib/editorial/urls";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import { listPublishedNews } from "@/lib/services/editorial-service";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Cobertura pública com notícias publicadas no fluxo editorial do Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/noticias"),
  },
  openGraph: {
    type: "website",
    title: "Notícias",
    description: "Cobertura pública com notícias publicadas no fluxo editorial do Nossa Voz RO.",
    url: absoluteUrl("/noticias"),
    images: defaultSocialImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Notícias",
    description: "Cobertura pública com notícias publicadas no fluxo editorial do Nossa Voz RO.",
    images: defaultSocialImage().map((image) => image.url),
  },
};

export default async function NoticiasPage() {
  const items = await listPublishedNews({ limit: 30 });
  const categories = Array.from(
    new Set(items.map((item) => item.category?.name).filter((value): value is string => Boolean(value))),
  );

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Noticias" }]} />

        <SectionHeading
          title="Noticias"
          subtitle="Cobertura pública com conteúdo já publicado no fluxo editorial." 
        />

        {categories.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <li key={category}>
                <Link href={buildCategoryHref(category)} className="inline-flex text-body-sm font-semibold">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

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
