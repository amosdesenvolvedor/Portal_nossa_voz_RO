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
import { getCategoryBySlug } from "@/config/site";
import { getDemoArticleByParams, getRelatedDemoArticles } from "@/data/article-demo";
import { formatEditorialDateTimeLabel, hasEditorialUpdate } from "@/lib/editorial/date";
import { buildCategoryHref, buildNewsHref } from "@/lib/editorial/urls";

type NewsArticlePageProps = {
  params: Promise<{
    categoria: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getDemoArticleByParams(resolvedParams.categoria, resolvedParams.slug);

  if (!article) {
    return {
      title: "Noticia nao encontrada",
      description: "A notícia solicitada não está disponível nesta fase demonstrativa.",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.categoria);

  if (!category) {
    notFound();
  }

  const article = getDemoArticleByParams(resolvedParams.categoria, resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedDemoArticles(article, 3);
  const publishedLabel = formatEditorialDateTimeLabel(article.publishedAtISO);
  const updatedLabel = article.updatedAtISO ? formatEditorialDateTimeLabel(article.updatedAtISO) : "";
  const locationLabel = [article.municipality, article.region].filter(Boolean).join(" • ") || undefined;

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-8 md:space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Notícias", href: "/noticias" },
            { label: category.label, href: category.href },
            { label: article.breadcrumbTitle },
          ]}
        />

        <article className="space-y-8 md:space-y-10">
          <header className="reading-column space-y-5">
            <Link href={buildCategoryHref(article.category)} className="inline-flex no-underline">
              <Badge variant="category">{article.category}</Badge>
            </Link>

            <div className="space-y-4">
              <h1 className="text-display">{article.title}</h1>
              <p className="text-body-lg text-text-muted">{article.summary}</p>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <EditorialByline author={article.author} role={article.authorRole} />
              <EditorialMeta
                publishedAtLabel={`Publicado em ${publishedLabel}`}
                publishedAtISO={article.publishedAtISO}
                municipality={locationLabel}
              />
              {hasEditorialUpdate(article.publishedAtISO, article.updatedAtISO) ? (
                <EditorialMeta publishedAtLabel={`Atualizada em ${updatedLabel}`} publishedAtISO={article.updatedAtISO} />
              ) : null}
            </div>
          </header>

          <section className="space-y-6" aria-label="Hero da matéria">
            <figure className="space-y-3">
              <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-border bg-surface-secondary md:aspect-[21/9]">
                {article.heroImage?.src ? (
                  <Image
                    src={article.heroImage.src}
                    alt={article.heroImage.alt ?? "Imagem principal demonstrativa da notícia"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                  />
                ) : (
                  <EditorialImagePlaceholder label="Hero editorial demonstrativo" />
                )}
              </div>

              <div className="reading-column">
                <EditorialImageCaption caption={article.heroImage?.caption} credit={article.heroImage?.credit} />
              </div>
            </figure>

            <div className="reading-column">
              <AdSlot position="ARTICLE_TOP" />
            </div>
          </section>

          <div className="reading-column space-y-8">
            <ArticleBody
              blocks={article.blocks}
              middleContentAfterBlock={4}
              middleContent={<AdSlot position="ARTICLE_MIDDLE" />}
            />

            <section className="space-y-3" aria-labelledby="article-tags-title">
              <h2 id="article-tags-title" className="text-h4">
                Tags
              </h2>
              <EditorialTagList tags={article.tags} />
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
                href={buildNewsHref(relatedArticle.category, relatedArticle.slug)}
                title={relatedArticle.title}
                summary={relatedArticle.summary}
                category={relatedArticle.category}
                municipality={[relatedArticle.municipality, relatedArticle.region].filter(Boolean).join(" • ") || "Rondônia"}
                publishedAt={formatEditorialDateTimeLabel(relatedArticle.publishedAtISO)}
                publishedAtISO={relatedArticle.publishedAtISO}
                imageSrc={relatedArticle.heroImage?.src}
                imageAlt={relatedArticle.heroImage?.alt}
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
