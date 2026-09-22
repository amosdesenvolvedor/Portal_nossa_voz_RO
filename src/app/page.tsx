import Link from "next/link";
import { AdSlot } from "@/components/home/AdSlot";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedStory } from "@/components/home/FeaturedStory";
import { LatestNewsList } from "@/components/home/LatestNewsList";
import { MunicipalityDirectory } from "@/components/home/MunicipalityDirectory";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_DEMO_DATA } from "@/data/home-demo";

export default function Home() {
  const lead = HOME_DEMO_DATA.leadStory;

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-8 md:space-y-10">
        <h1 className="sr-only">Nossa Voz RO - Inicio</h1>

        <AdSlot position="HOME_TOP" />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <FeaturedStory story={lead} />

          <div className="space-y-4">
            {HOME_DEMO_DATA.secondaryHighlights.map((story) => (
              <article key={story.slug} className="surface-card p-4 md:p-5">
                <p className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">{story.category}</p>
                <h2 className="mt-2 text-h4">
                  <Link href={`/noticias/${story.category.toLowerCase().replace(/\s+/g, "-")}/${story.slug}`} className="text-text no-underline hover:text-brand-secondary">
                    {story.title}
                  </Link>
                </h2>
                <p className="mt-2 text-body-sm text-text-muted">{story.summary}</p>
                <div className="mt-3 flex items-center gap-2 text-caption text-text-muted">
                  <span>{story.municipality}</span>
                  <span aria-hidden>•</span>
                  <time dateTime="2026-09-22T09:00:00-04:00">{story.publishedAt}</time>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_320px]">
          <div className="space-y-10">
            <section className="space-y-5">
              <SectionHeading
                title="Ultimas noticias"
                subtitle="Fluxo cronologico demonstrativo para futuras atualizacoes editoriais em tempo de publicacao."
              />
              <LatestNewsList items={HOME_DEMO_DATA.latestNews} />
            </section>

            <section className="space-y-5">
              <SectionHeading
                title="Nossa regiao"
                subtitle="Cobertura regional com foco na Zona da Mata e no eixo da BR-429."
                actions={
                  <Link href="/municipios" className="text-body-sm font-semibold">
                    Ver municipios
                  </Link>
                }
              />

              <div className="grid gap-4 md:grid-cols-2">
                {HOME_DEMO_DATA.regionalNews.map((story, index) => (
                  <NewsCard
                    key={story.slug}
                    className={index === 0 ? "md:col-span-2" : undefined}
                    href={`/noticias/${story.category.toLowerCase().replace(/\s+/g, "-")}/${story.slug}`}
                    title={story.title}
                    summary={story.summary}
                    category={story.category}
                    municipality={story.municipality}
                    publishedAt={story.publishedAt}
                    imageSrc={story.imageSrc}
                    imageAlt={story.imageAlt}
                  />
                ))}
              </div>
            </section>

            <AdSlot position="HOME_MIDDLE" />

            <MunicipalityDirectory items={HOME_DEMO_DATA.municipalityLinks} />

            <section className="space-y-5" aria-labelledby="editorias-home-title">
              <header className="space-y-2">
                <h2 id="editorias-home-title" className="text-h2">
                  Editorias em destaque
                </h2>
                <p className="text-body-sm text-text-muted">
                  Composicao inicial da Home com secoes editaveis futuramente via curadoria editorial.
                </p>
              </header>

              <div className="space-y-8">
                {HOME_DEMO_DATA.categoryBlocks.map((block) => (
                  <CategorySection key={block.id} block={block} />
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2" aria-label="Entradas de servicos editoriais">
              {HOME_DEMO_DATA.jobsAndClassifiedsLinks.map((entry) => (
                <article key={entry.href} className="surface-card p-5">
                  <h2 className="text-h3">
                    <Link href={entry.href} className="text-text no-underline hover:text-brand-secondary">
                      {entry.label}
                    </Link>
                  </h2>
                  <p className="mt-2 text-body-sm text-text-muted">{entry.description}</p>
                </article>
              ))}
            </section>

            <div className="flex justify-center">
              <Link
                href="/noticias"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-5 text-body font-semibold no-underline text-text hover:bg-surface-secondary"
              >
                Ver mais noticias
              </Link>
            </div>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start" aria-label="Barra lateral">
            <AdSlot position="SIDEBAR" />

            <section className="surface-card p-5">
              <h2 className="text-h4">Acompanhe tambem</h2>
              <Divider className="my-3" />
              <ul className="space-y-3">
                {HOME_DEMO_DATA.sidebarStories.map((story) => (
                  <li key={story.slug}>
                    <article className="space-y-1.5">
                      <p className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">{story.category}</p>
                      <h3 className="text-body font-semibold">
                        <Link href={`/noticias/${story.category.toLowerCase().replace(/\s+/g, "-")}/${story.slug}`} className="text-text no-underline hover:text-brand-secondary">
                          {story.title}
                        </Link>
                      </h3>
                      <p className="text-caption text-text-muted">{story.municipality}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5">
              <h2 className="text-h4">Acesso rapido</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/noticias/empregos" className="text-body-sm font-semibold">
                    Empregos
                  </Link>
                </li>
                <li>
                  <Link href="/noticias/classificados" className="text-body-sm font-semibold">
                    Classificados
                  </Link>
                </li>
                <li>
                  <Link href="/municipios" className="text-body-sm font-semibold">
                    Cobertura por municipios
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  );
}
