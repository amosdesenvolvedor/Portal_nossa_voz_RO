import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/db/prisma";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { buildNewsHref } from "@/lib/editorial/urls";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const author = await prisma.user.findFirst({
    where: { publicSlug: resolvedParams.slug, isAuthorProfileActive: true },
    include: {
      assignedAuthoredNews: {
        where: { status: "PUBLISHED" },
        include: { category: true, municipality: true },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      },
    },
  });

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
