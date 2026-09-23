import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildNewsHref } from "@/lib/editorial/urls";
import { listPublishedNewsByCategorySlug } from "@/lib/services/editorial-service";

type CategoryPageProps = {
  params: Promise<{
    categoria: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const items = await listPublishedNewsByCategorySlug(resolvedParams.categoria);

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
