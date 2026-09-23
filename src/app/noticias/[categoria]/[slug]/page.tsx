import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/home/AdSlot";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ShareActions } from "@/components/article/ShareActions";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { EditorialByline } from "@/components/editorial/EditorialByline";
import { EditorialImageCaption } from "@/components/editorial/EditorialImageCaption";
import { EditorialMeta } from "@/components/editorial/EditorialMeta";
import { EditorialTagList } from "@/components/editorial/EditorialTagList";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EditorialImagePlaceholder } from "@/components/ui/EditorialImagePlaceholder";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { EditorialContentBlock } from "@/lib/editorial/article-blocks";
import { formatEditorialDateTimeLabel, hasEditorialUpdate } from "@/lib/editorial/date";
import { editorialContentBlocksSchema } from "@/lib/editorial/validation";
import { buildCategoryHref, buildNewsHref } from "@/lib/editorial/urls";
import {
  getPublishedArticleByRoute,
  getRelatedPublishedArticles,
} from "@/lib/services/editorial-service";

type NewsArticlePageProps = {
  params: Promise<{
    categoria: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getPublishedArticleByRoute(resolvedParams.categoria, resolvedParams.slug);

  if (!article) {
    return {
      title: "Noticia nao encontrada",
      description: "A notícia solicitada não está disponível.",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const resolvedParams = await params;
  const article = await getPublishedArticleByRoute(resolvedParams.categoria, resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedPublishedArticles(article.id, article.categoryId ?? "", 3);
  const contentBlocks = editorialContentBlocksSchema.safeParse(article.contentBlocks);
  const blocks: EditorialContentBlock[] = contentBlocks.success
    ? contentBlocks.data
    : [
        {
          type: "paragraph",
          content: [{ type: "text", text: article.content || "Conteúdo indisponível." }],
        },
      ];

  const publishedIso = article.publishedAt?.toISOString() ?? article.updatedAt.toISOString();
  const updatedIso = article.updatedAt.toISOString();
  const publishedLabel = formatEditorialDateTimeLabel(publishedIso);
  const updatedLabel = updatedIso ? formatEditorialDateTimeLabel(updatedIso) : "";
  const categoryLabel = article.category?.name ?? "Notícias";
  const authorName = article.author?.name ?? article.createdBy.name;
  const locationLabel = [article.municipality?.name, article.region?.name].filter(Boolean).join(" • ") || undefined;

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-8 md:space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Notícias", href: "/noticias" },
            { label: categoryLabel, href: buildCategoryHref(categoryLabel) },
            { label: article.title },
          ]}
        />

        <article className="space-y-8 md:space-y-10">
          <header className="reading-column space-y-5">
            <Link href={buildCategoryHref(categoryLabel)} className="inline-flex no-underline">
              <Badge variant="category">{categoryLabel}</Badge>
            </Link>

            <div className="space-y-4">
              <h1 className="break-words text-display">{article.title}</h1>
              <p className="break-words text-body-lg text-text-muted">{article.summary ?? ""}</p>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <EditorialByline author={authorName} role={article.author?.role ?? "Equipe editorial"} />
              <EditorialMeta
                publishedAtLabel={`Publicado em ${publishedLabel}`}
                publishedAtISO={publishedIso}
                municipality={locationLabel}
              />
              {hasEditorialUpdate(publishedIso, updatedIso) ? (
                <EditorialMeta publishedAtLabel={`Atualizada em ${updatedLabel}`} publishedAtISO={updatedIso} />
              ) : null}
            </div>
          </header>

          <section className="space-y-6" aria-label="Hero da matéria">
            <figure className="space-y-3">
              <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-border bg-surface-secondary md:aspect-[21/9]">
                {article.heroImageUrl ? (
                  <Image
                    src={article.heroImageUrl}
                    alt={article.heroImageAlt ?? "Imagem principal da notícia"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                  />
                ) : (
                  <EditorialImagePlaceholder label="Hero editorial" />
                )}
              </div>

              <div className="reading-column">
                <EditorialImageCaption
                  caption={article.heroImageCaption ?? undefined}
                  credit={article.heroImageCredit ?? undefined}
                />
              </div>
            </figure>

            <div className="reading-column">
              <AdSlot position="ARTICLE_TOP" />
            </div>
          </section>

          <div className="reading-column space-y-8">
            <ArticleBody
              blocks={blocks}
              middleContentAfterBlock={4}
              middleContent={<AdSlot position="ARTICLE_MIDDLE" />}
            />

            <section className="space-y-3" aria-labelledby="article-tags-title">
              <h2 id="article-tags-title" className="text-h4">
                Tags
              </h2>
              <EditorialTagList tags={article.tags.map((tag) => ({ label: tag.name }))} />
            </section>

            <section className="space-y-3" aria-labelledby="article-share-title">
              <h2 id="article-share-title" className="text-h4">
                Compartilhar
              </h2>
              <ShareActions title={article.title} />
            </section>
          </div>
        </article>

        <section className="space-y-5" aria-label="Notícias relacionadas">
          <SectionHeading
            title="Notícias relacionadas"
            subtitle="Seleção demonstrativa para validar navegação entre matérias e reaproveitamento da camada editorial."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard
                key={relatedArticle.slug}
                href={buildNewsHref(relatedArticle.category?.name ?? "noticias", relatedArticle.slug)}
                title={relatedArticle.title}
                summary={relatedArticle.summary ?? ""}
                category={relatedArticle.category?.name ?? "Notícias"}
                municipality={[relatedArticle.municipality?.name, relatedArticle.region?.name].filter(Boolean).join(" • ") || "Rondônia"}
                publishedAt={formatEditorialDateTimeLabel(relatedArticle.publishedAt ?? relatedArticle.updatedAt)}
                publishedAtISO={relatedArticle.publishedAt?.toISOString()}
                imageSrc={relatedArticle.heroImageUrl ?? undefined}
                imageAlt={relatedArticle.heroImageAlt ?? undefined}
                variant="horizontal"
              />
            ))}
          </div>
        </section>

        <div className="reading-column">
          <AdSlot position="ARTICLE_BOTTOM" />
        </div>
      </Container>
    </main>
  );
}
