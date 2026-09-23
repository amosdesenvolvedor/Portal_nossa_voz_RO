import type { AdPosition } from "@/lib/domain/editorial";

export type DemoStory = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  municipality: string;
  publishedAt: string;
  publishedAtISO?: string;
  author?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type LatestItem = {
  timeLabel: string;
  publishedAtISO: string;
  category: string;
  title: string;
  municipality?: string;
  href: string;
};

export type CategoryBlock = {
  id: string;
  title: string;
  description: string;
  href: string;
  stories: DemoStory[];
};

export type HomeDemoData = {
  leadStory: DemoStory;
  secondaryHighlights: DemoStory[];
  latestNews: LatestItem[];
  regionalNews: DemoStory[];
  categoryBlocks: CategoryBlock[];
  municipalityLinks: Array<{ name: string; href: string }>;
  jobsAndClassifiedsLinks: Array<{ label: string; href: string; description: string }>;
  sidebarStories: DemoStory[];
  adSlots: AdPosition[];
};

// Prompt 04 fixtures: demonstrative-only content for layout validation.
// Future prompts should replace this source with DB-backed queries/services.
export const HOME_DEMO_DATA: HomeDemoData = {
  leadStory: {
    slug: "plataforma-editorial-em-evolucao",
    category: "Notícias locais",
    title: "Portal Nossa Voz RO prepara estrutura editorial para ampliar cobertura regional",
    summary:
      "Conteúdo demonstrativo para validar a área de manchete principal da Home com foco em leitura, hierarquia e navegação.",
    municipality: "Zona da Mata",
    publishedAt: "22 set 2026 • 09:40",
    publishedAtISO: "2026-09-22T09:40:00-04:00",
  },
  secondaryHighlights: [
    {
      slug: "organizacao-por-municipios",
      category: "Política",
      title: "Nova organização por municípios facilita acesso a pautas regionais",
      summary: "Exemplo neutro para validar destaque secundário com hierarquia menor que a manchete.",
      municipality: "Rolim de Moura",
      publishedAt: "22 set 2026 • 09:12",
      publishedAtISO: "2026-09-22T09:12:00-04:00",
      imageSrc: "/globe.svg",
      imageAlt: "Ilustração demonstrativa",
    },
    {
      slug: "redacao-fluxo-editorial",
      category: "Agricultura",
      title: "Redação estrutura fluxo para acompanhar temas do campo e da produção local",
      summary: "Conteúdo demonstrativo de apoio para composição editorial da Home.",
      municipality: "São Miguel do Guaporé",
      publishedAt: "22 set 2026 • 08:55",
      publishedAtISO: "2026-09-22T08:55:00-04:00",
    },
    {
      slug: "painel-categorias-publicas",
      category: "Polícia",
      title: "Seção de segurança pública recebe espaço neutro para futuras atualizações",
      summary: "Item demonstrativo sem fatos reais para validar densidade da coluna lateral de destaques.",
      municipality: "Alta Floresta d'Oeste",
      publishedAt: "22 set 2026 • 08:27",
      publishedAtISO: "2026-09-22T08:27:00-04:00",
    },
  ],
  latestNews: [
    {
      timeLabel: "09:42",
      publishedAtISO: "2026-09-22T09:42:00-04:00",
      category: "Política",
      title: "Home passa a exibir hierarquia editorial com foco em leitura mobile",
      municipality: "Rolim de Moura",
      href: "/noticias/politica/home-com-hierarquia-editorial",
    },
    {
      timeLabel: "09:15",
      publishedAtISO: "2026-09-22T09:15:00-04:00",
      category: "Saúde",
      title: "Estrutura de seções prepara entradas para novos cadernos regionais",
      municipality: "Zona da Mata",
      href: "/noticias/saude/estrutura-de-secoes-regionais",
    },
    {
      timeLabel: "08:58",
      publishedAtISO: "2026-09-22T08:58:00-04:00",
      category: "Educação",
      title: "Layout de notícias em ordem cronológica é validado para próximas etapas",
      href: "/noticias/educacao/layout-cronologico-validado",
    },
    {
      timeLabel: "08:30",
      publishedAtISO: "2026-09-22T08:30:00-04:00",
      category: "Economia",
      title: "Navegacao publica passa a integrar blocos editoriais da Home",
      municipality: "BR-429",
      href: "/noticias/economia/navegacao-publica-integrada",
    },
    {
      timeLabel: "08:02",
      publishedAtISO: "2026-09-22T08:02:00-04:00",
      category: "Cultura",
      title: "Componentes do design system sustentam crescimento do portal",
      href: "/noticias/cultura/componentes-sustentam-crescimento",
    },
  ],
  regionalNews: [
    {
      slug: "cobertura-zona-da-mata",
      category: "Notícias locais",
      title: "Cobertura da Zona da Mata ganha bloco próprio na página inicial",
      summary: "Exemplo demonstrativo de matéria regional com identificação clara de município e contexto.",
      municipality: "Alta Floresta d'Oeste",
      publishedAt: "22 set 2026 • 07:45",
      publishedAtISO: "2026-09-22T07:45:00-04:00",
      imageSrc: "/window.svg",
      imageAlt: "Ilustração demonstrativa de cobertura local",
    },
    {
      slug: "eixo-br-429",
      category: "Eventos",
      title: "Eixo da BR-429 entra na estrutura de destaque regional da Home",
      summary: "Conteúdo ilustrativo para validar seção Nossa Região sem dependência de dados externos.",
      municipality: "BR-429",
      publishedAt: "22 set 2026 • 07:18",
      publishedAtISO: "2026-09-22T07:18:00-04:00",
    },
    {
      slug: "municipios-em-evidencia",
      category: "Notícias locais",
      title: "Página inicial passa a destacar links diretos para municípios",
      summary: "Demonstração da estratégia regional para navegação por localidade.",
      municipality: "São Miguel do Guaporé",
      publishedAt: "22 set 2026 • 06:52",
      publishedAtISO: "2026-09-22T06:52:00-04:00",
    },
  ],
  categoryBlocks: [
    {
      id: "politica",
      title: "Política",
      description: "Espaço editorial neutro para cobertura institucional e cidadania.",
      href: "/noticias/politica",
      stories: [
        {
          slug: "painel-editorial-politica",
          category: "Política",
          title: "Seção de política recebe estrutura pronta para curadoria futura",
          summary: "Modelo demonstrativo para futuras escolhas editoriais sem conteúdo factual real.",
          municipality: "Rondônia",
          publishedAt: "22 set 2026 • 06:35",
          publishedAtISO: "2026-09-22T06:35:00-04:00",
        },
        {
          slug: "rotas-publicas-politica",
          category: "Política",
          title: "Rotas públicas por categoria são conectadas a blocos de destaque",
          summary: "Exemplo de item secundário para composição da seção.",
          municipality: "Zona da Mata",
          publishedAt: "22 set 2026 • 06:10",
          publishedAtISO: "2026-09-22T06:10:00-04:00",
        },
      ],
    },
    {
      id: "agricultura",
      title: "Agricultura",
      description: "Área para temas de produção, tecnologia e rotina do campo regional.",
      href: "/noticias/agricultura",
      stories: [
        {
          slug: "caderno-campo",
          category: "Agricultura",
          title: "Home prepara caderno visual dedicado ao campo e a produtores",
          summary: "Conteúdo fictício e neutro para validar distribuição de notícias por editoria.",
          municipality: "Rolim de Moura",
          publishedAt: "22 set 2026 • 05:48",
          publishedAtISO: "2026-09-22T05:48:00-04:00",
        },
        {
          slug: "tecnologia-rural",
          category: "Agricultura",
          title: "Estrutura suporta notícias sobre tecnologia aplicada ao setor rural",
          summary: "Item de demonstração para visualizar variação de títulos na mesma seção.",
          municipality: "Alta Floresta d'Oeste",
          publishedAt: "22 set 2026 • 05:21",
          publishedAtISO: "2026-09-22T05:21:00-04:00",
        },
      ],
    },
    {
      id: "policia",
      title: "Polícia",
      description: "Bloco visual reservado para cobertura futura, sem relatos fictícios sensíveis.",
      href: "/noticias/policia",
      stories: [
        {
          slug: "secao-policia-neutra",
          category: "Polícia",
          title: "Seção de polícia foi preparada com linguagem editorial neutra",
          summary: "Exemplo propositalmente genérico para validar layout sem criar narrativas indevidas.",
          municipality: "São Miguel do Guaporé",
          publishedAt: "22 set 2026 • 05:02",
          publishedAtISO: "2026-09-22T05:02:00-04:00",
        },
      ],
    },
  ],
  municipalityLinks: [
    { name: "Rolim de Moura", href: "/municipios/rolim-de-moura" },
    { name: "Alta Floresta d'Oeste", href: "/municipios/alta-floresta-doeste" },
    { name: "São Miguel do Guaporé", href: "/municipios/sao-miguel-do-guapore" },
    { name: "Alto Alegre dos Parecis", href: "/municipios/alto-alegre-dos-parecis" },
    { name: "Costa Marques", href: "/municipios/costa-marques" },
  ],
  jobsAndClassifiedsLinks: [
    {
      label: "Empregos",
      href: "/noticias/empregos",
      description: "Acesso rápido para oportunidades e informações de mercado de trabalho.",
    },
    {
      label: "Classificados",
      href: "/noticias/classificados",
      description: "Entrada editorial para classificados e serviços locais em evolução futura.",
    },
  ],
  sidebarStories: [
    {
      slug: "estrutura-noticias-curtas",
      category: "Notícias locais",
      title: "Formato de notas curtas preparado para atualizações ao longo do dia",
      summary: "Item demonstrativo para coluna lateral.",
      municipality: "BR-429",
      publishedAt: "22 set 2026 • 04:40",
      publishedAtISO: "2026-09-22T04:40:00-04:00",
    },
    {
      slug: "agenda-regional",
      category: "Eventos",
      title: "Bloco de agenda regional será integrado com curadoria futura",
      summary: "Exemplo visual de chamada lateral.",
      municipality: "Zona da Mata",
      publishedAt: "22 set 2026 • 04:15",
      publishedAtISO: "2026-09-22T04:15:00-04:00",
    },
  ],
  adSlots: ["HOME_TOP", "HOME_MIDDLE", "SIDEBAR"],
};
