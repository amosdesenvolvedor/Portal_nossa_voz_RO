import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { EditorialByline } from "@/components/editorial/EditorialByline";
import { EditorialEmptyState } from "@/components/editorial/EditorialEmptyState";
import { EditorialImageCaption } from "@/components/editorial/EditorialImageCaption";
import { EditorialMeta } from "@/components/editorial/EditorialMeta";
import { EditorialPagination } from "@/components/editorial/EditorialPagination";
import { EditorialTagList } from "@/components/editorial/EditorialTagList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const colorTokens = [
  { label: "brand-primary", className: "bg-brand-primary", textClassName: "text-text-inverse" },
  { label: "brand-secondary", className: "bg-brand-secondary", textClassName: "text-text-inverse" },
  { label: "accent", className: "bg-brand-accent", textClassName: "text-text" },
  { label: "accent-light", className: "bg-brand-accentLight", textClassName: "text-text" },
  { label: "surface", className: "bg-surface", textClassName: "text-text" },
  { label: "surface-secondary", className: "bg-surface-secondary", textClassName: "text-text" },
  { label: "text-muted", className: "bg-text-muted", textClassName: "text-text-inverse" },
  { label: "semantic-success", className: "bg-semantic-success", textClassName: "text-text-inverse" },
  { label: "semantic-info", className: "bg-semantic-info", textClassName: "text-text-inverse" },
  { label: "semantic-warning", className: "bg-semantic-warning", textClassName: "text-text-inverse" },
  { label: "semantic-danger", className: "bg-semantic-danger", textClassName: "text-text-inverse" },
];

const demoNews = [
  {
    title: "Portal Nossa Voz RO inicia preparacao de sua nova plataforma digital",
    summary:
      "Conteudo demonstrativo para validar tipografia, espacamento, links e comportamento responsivo do card base.",
    category: "Política",
    municipality: "Rolim de Moura",
    publishedAt: "22 set 2026",
    author: "Redacao Demonstrativa",
  },
  {
    title: "Cobertura regional da BR-429 ganha estrutura editorial dedicada",
    summary:
      "Exemplo ficticio usado exclusivamente para validacao visual do componente de noticia sem depender de dados reais.",
    category: "Notícias locais",
    municipality: "Alta Floresta d'Oeste",
    publishedAt: "21 set 2026",
  },
] as const;

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-canvas py-10 md:py-14">
      <Container as="main" className="space-y-12 md:space-y-16">
        <section className="surface-card animate-fade-in-up p-6 md:p-10">
          <BrandLogo className="max-w-[220px] md:max-w-[280px]" href="/" />
          <h1 className="text-display mt-3 text-brand-primary">Design System de Fundacao</h1>
          <p className="mt-4 max-w-reading text-body-lg text-text-muted">
            Esta pagina e interna para validar componentes, tokens e padroes visuais da identidade do portal.
            A Home final sera implementada em prompt posterior.
          </p>
          <p className="mt-3 text-body-sm text-text-muted">Logo oficial integrada a partir de public/brand/nossa-voz-ro.png.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" endIcon={<ArrowRightIcon />}>Ver proximos modulos</Button>
            <Button variant="outline" startIcon={<PlusIcon />}>Criar noticia (demo)</Button>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Identidade"
            title="Paleta e tokens"
            subtitle="A marca prioriza verde e amarelo com suporte semantico para estados funcionais."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <article key={token.label} className="surface-card overflow-hidden">
                <div className={`${token.className} flex h-20 items-end p-3`}>
                  <span className={`${token.textClassName} text-caption font-semibold uppercase`}>{token.label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Tipografia"
            title="Escala responsiva para jornalismo digital"
            subtitle="Hierarquia para manchete, titulos de secao, resumo e metadados em diferentes tamanhos de tela."
          />
          <div className="surface-card space-y-3 p-5 md:p-7">
            <p className="text-display">Display / Manchete Principal</p>
            <p className="text-h1">H1 - Titulo de materia de alto destaque</p>
            <p className="text-h2">H2 - Titulo de secao editorial</p>
            <p className="text-h3">H3 - Titulo de noticia em grade</p>
            <p className="text-h4">H4 - Subtitulo curto</p>
            <p className="text-body-lg text-text-muted">Body Large para resumos e chamadas de abertura.</p>
            <p className="text-body">Body para leitura principal e informacoes gerais.</p>
            <p className="text-body-sm text-text-muted">Body Small para complementos.</p>
            <p className="text-caption uppercase tracking-[0.08em] text-text-muted">Caption e metadata</p>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Interacao" title="Botoes e links" subtitle="Estados de foco visivel, hover, active e disabled." />
          <div className="surface-card space-y-6 p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button size="icon" variant="outline" aria-label="Abrir filtro demonstrativo" startIcon={<PlusIcon />} />
            </div>
            <p className="text-body-sm text-text-muted">
              Exemplo de link editorial: <Link href="#">Leia a cobertura completa da regiao da BR-429</Link>.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Classificacao"
            title="Badges e tags"
            subtitle="Categorias, municipios e tags usam o mesmo idioma visual para evitar poluicao cromatica."
          />
          <div className="surface-card flex flex-wrap items-center gap-3 p-5 md:p-7">
            <Badge variant="category">Política</Badge>
            <Badge variant="category">Saúde</Badge>
            <Badge variant="municipality">Rolim de Moura</Badge>
            <Badge variant="tag">Agricultura</Badge>
            <Badge variant="status">In Review</Badge>
          </div>
        </section>

        <section className="space-y-6 pb-6">
          <SectionHeading
            eyebrow="Componente Base"
            title="News Card"
            subtitle="Padrao visual para listagens de noticias com e sem imagem, mantendo legibilidade e proporcao editorial."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <NewsCard {...demoNews[0]} imageSrc="/globe.svg" imageAlt="Imagem demonstrativa do card" />
            <NewsCard {...demoNews[1]} variant="horizontal" />
            <NewsCard {...demoNews[1]} variant="compact" />
          </div>
        </section>

        <section className="space-y-6 pb-6">
          <SectionHeading
            eyebrow="Editorial"
            title="Metadados e estrutura reutilizavel"
            subtitle="Componentes compartilhados para autoria, tags, legenda de imagem, vazio e paginacao."
          />

          <div className="surface-card space-y-5 p-5 md:p-7">
            <EditorialMeta
              publishedAtLabel="22 set 2026 • 09:40"
              publishedAtISO="2026-09-22T09:40:00-04:00"
              municipality="Zona da Mata"
              author="Redacao Demonstrativa"
            />
            <EditorialByline author="Redacao Demonstrativa" role="Equipe local" />
            <EditorialTagList
              tags={[
                { label: "Politica", href: "/noticias/politica" },
                { label: "Zona da Mata" },
                { label: "Cobertura regional" },
              ]}
            />
            <figure className="space-y-2">
              <div className="h-24 rounded-sm border border-border bg-surface-secondary" />
              <EditorialImageCaption
                caption="Imagem demonstrativa para composicao editorial"
                credit="Arquivo interno"
              />
            </figure>

            <EditorialPagination currentPage={2} totalPages={5} hrefForPage={(page) => `/noticias?page=${page}`} />

            <EditorialEmptyState
              title="Nenhuma materia encontrada"
              description="Use filtros diferentes ou volte para a pagina de noticias para continuar navegando."
              action={
                <Link href="/noticias" className="text-body-sm font-semibold">
                  Ver noticias
                </Link>
              }
            />
          </div>
        </section>
      </Container>
    </div>
  );
}