import type { EditorialContentBlock } from "@/lib/editorial/article-blocks";
import type { EditorialPresentationImage, EditorialPresentationTag } from "@/lib/editorial/presentation";
import { toUrlSlug } from "@/config/site";

export type DemoArticle = {
  slug: string;
  category: string;
  title: string;
  breadcrumbTitle: string;
  summary: string;
  author: string;
  authorRole?: string;
  municipality?: string;
  region?: string;
  publishedAtISO: string;
  updatedAtISO?: string;
  heroImage?: EditorialPresentationImage;
  blocks: EditorialContentBlock[];
  tags: EditorialPresentationTag[];
  relatedSlugs: string[];
};

function text(textValue: string, emphasis?: "strong" | "em") {
  return { type: "text" as const, text: textValue, emphasis };
}

function link(textValue: string, href: string) {
  return { type: "link" as const, text: textValue, href };
}

const DEMO_ARTICLES: DemoArticle[] = [
  {
    slug: "plataforma-editorial-regional",
    category: "Política",
    title: "Portal Nossa Voz RO prepara nova plataforma para ampliar cobertura regional",
    breadcrumbTitle: "Nova plataforma regional",
    summary:
      "Matéria demonstrativa sobre a organização editorial e técnica do portal, preparada para validar a página individual de notícia sem depender de banco nesta etapa.",
    author: "Redacao Nossa Voz RO",
    authorRole: "Equipe editorial",
    municipality: "Rolim de Moura",
    region: "Zona da Mata",
    publishedAtISO: "2026-09-22T09:40:00-04:00",
    updatedAtISO: "2026-09-22T11:05:00-04:00",
    heroImage: {
      src: "/window.svg",
      alt: "Ilustração demonstrativa para a matéria sobre a nova plataforma editorial",
      caption: "Composição demonstrativa usada para validar a área hero da matéria.",
      credit: "Arquivo interno",
    },
    tags: [
      { label: "Política", href: "/noticias/politica" },
      { label: "Jornalismo regional" },
      { label: "Nossa Voz RO" },
      { label: "Rondônia" },
    ],
    relatedSlugs: ["organizacao-por-municipios", "camada-editorial-reutilizavel", "fluxo-editorial-humano"],
    blocks: [
      {
        type: "paragraph",
        content: [
          text("O portal Nossa Voz RO segue em desenvolvimento com foco em uma base publica capaz de crescer sem perder clareza editorial. Nesta fase, a prioridade foi estruturar a pagina individual de noticia e preparar uma camada inicial de assistencia editorial com IA que funcione apenas como "),
          text("sugestão", "strong"),
          text(", nunca como publicação automática."),
        ],
      },
      {
        type: "paragraph",
        content: [
          text("O conteúdo desta matéria é demonstrativo e existe para validar tipografia, largura de leitura, metadata, compartilhamento e organização semântica da rota "),
          link("/noticias/[categoria]/[slug]", "/noticias"),
          text(" dentro da arquitetura pública do portal."),
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Cobertura regional como eixo da arquitetura",
      },
      {
        type: "paragraph",
        content: [
          text("A plataforma foi desenhada para acomodar cobertura por categoria, município e região. Isso permite destacar editorias amplas sem perder a leitura local, algo essencial para a proposta de acompanhar a Zona da Mata, a BR-429 e outros contextos municipais de Rondônia."),
        ],
      },
      {
        type: "list",
        style: "unordered",
        items: [
          [text("rotas públicas coerentes para Home, categorias, municípios e autores")],
          [text("componentes editoriais reutilizáveis para metadata, autoria, tags e estados vazios")],
          [text("espaços de publicidade preparados sem dependência de rede externa nesta etapa")],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Assistência editorial, não autoridade editorial",
      },
      {
        type: "paragraph",
        content: [
          text("A base de IA foi preparada para sugerir títulos, subtítulos, resumos, tags, revisões e rascunhos iniciais. Mesmo assim, a regra do projeto permanece direta: "),
          text("humano revisa, humano decide, humano publica", "strong"),
          text("."),
        ],
      },
      {
        type: "quote",
        text: "Se faltarem informações, a assistência editorial deve apontar a lacuna em vez de preencher o texto com fatos inventados.",
        citation: "Diretriz editorial demonstrativa do projeto",
      },
      {
        type: "heading",
        level: 3,
        text: "Preparação para o futuro painel",
      },
      {
        type: "paragraph",
        content: [
          text("Nenhum painel administrativo completo foi criado agora. Em vez disso, a estrutura server-side foi isolada para que um fluxo futuro de edição possa consumir o serviço sem expor segredo no navegador e sem acoplar a aplicação pública ao provedor inicial."),
        ],
      },
      {
        type: "paragraph",
        content: [
          text("A navegação pública já existente continua preservada, incluindo a Home aprovada, as entradas por categoria e a listagem de municípios. O próximo passo natural será substituir fixtures por consultas reais mantendo os contratos apresentados nesta fase."),
        ],
      },
    ],
  },
  {
    slug: "organizacao-por-municipios",
    category: "Política",
    title: "Organização por municípios reforça leitura territorial do portal",
    breadcrumbTitle: "Organização por municípios",
    summary:
      "Entrada demonstrativa usada em notícias relacionadas para validar navegação entre matérias da mesma editoria.",
    author: "Redacao Nossa Voz RO",
    municipality: "Alta Floresta d'Oeste",
    region: "Zona da Mata",
    publishedAtISO: "2026-09-22T08:25:00-04:00",
    heroImage: {
      alt: "Placeholder editorial demonstrativo",
    },
    tags: [{ label: "Política", href: "/noticias/politica" }],
    relatedSlugs: ["plataforma-editorial-regional", "camada-editorial-reutilizavel"],
    blocks: [
      {
        type: "paragraph",
        content: [text("Matéria demonstrativa secundária criada para permitir navegação coerente entre slugs relacionados durante os testes desta fase.")],
      },
    ],
  },
  {
    slug: "camada-editorial-reutilizavel",
    category: "Política",
    title: "Camada editorial reutilizável reduz duplicação na apresentação das matérias",
    breadcrumbTitle: "Camada editorial reutilizável",
    summary:
      "Outra entrada demonstrativa para a seção de relacionados, destacando a consolidação de componentes compartilhados.",
    author: "Redacao Nossa Voz RO",
    municipality: "São Miguel do Guaporé",
    region: "Zona da Mata",
    publishedAtISO: "2026-09-22T07:55:00-04:00",
    tags: [{ label: "Jornalismo regional" }],
    relatedSlugs: ["plataforma-editorial-regional", "fluxo-editorial-humano"],
    blocks: [
      {
        type: "paragraph",
        content: [text("Conteúdo demonstrativo de apoio para o fluxo de relacionados e para o comportamento de notFound em slugs inexistentes.")],
      },
    ],
  },
  {
    slug: "fluxo-editorial-humano",
    category: "Noticias locais",
    title: "Fluxo editorial permanece centrado em decisão humana autorizada",
    breadcrumbTitle: "Fluxo editorial humano",
    summary:
      "Entrada demonstrativa de editoria diferente para validar variedade de relacionados sem algoritmo real.",
    author: "Redacao Nossa Voz RO",
    municipality: "BR-429",
    publishedAtISO: "2026-09-22T07:20:00-04:00",
    tags: [{ label: "Nossa Voz RO" }],
    relatedSlugs: ["plataforma-editorial-regional"],
    blocks: [
      {
        type: "paragraph",
        content: [text("Conteúdo fictício e institucional para validar a página individual de notícia em mais de uma editoria pública.")],
      },
    ],
  },
];

export function getAllDemoArticles(): DemoArticle[] {
  return DEMO_ARTICLES;
}

export function getDemoArticleByParams(categorySlug: string, slug: string): DemoArticle | null {
  return (
    DEMO_ARTICLES.find((article) => toUrlSlug(article.category) === categorySlug && article.slug === slug) ?? null
  );
}

export function getRelatedDemoArticles(article: DemoArticle, limit = 3): DemoArticle[] {
  const relatedArticles = article.relatedSlugs
    .map((slug) => DEMO_ARTICLES.find((candidate) => candidate.slug === slug) ?? null)
    .filter((candidate): candidate is DemoArticle => Boolean(candidate));

  return relatedArticles.slice(0, limit);
}