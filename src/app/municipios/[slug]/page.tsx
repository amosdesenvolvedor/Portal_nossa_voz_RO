import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/db/prisma";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildNewsHref } from "@/lib/editorial/urls";

type MunicipalityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const resolvedParams = await params;
  const municipality = await prisma.municipality.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      region: true,
      news: {
        where: { status: "PUBLISHED" },
        include: { category: true, municipality: true },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      },
    },
  });

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
