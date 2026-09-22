import type { AdPosition } from "@/lib/domain/editorial";

export type DemoStory = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  municipality: string;
  publishedAt: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type LatestItem = {
  time: string;
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
    category: "Noticias Locais",
    title: "Portal Nossa Voz RO prepara estrutura editorial para ampliar cobertura regional",
    summary:
      "Conteudo demonstrativo para validar a area de manchete principal da Home com foco em leitura, hierarquia e navegacao.",
    municipality: "Zona da Mata",
    publishedAt: "22 set 2026 • 09:40",
    imageSrc: "/brand/nossa-voz-ro.png",
    imageAlt: "Logo oficial do portal em destaque demonstrativo",
  },
  secondaryHighlights: [
    {
      slug: "organizacao-por-municipios",
      category: "Politica",
      title: "Nova organizacao por municipios facilita acesso a pautas regionais",
      summary: "Exemplo neutro para validar destaque secundario com hierarquia menor que a manchete.",
      municipality: "Rolim de Moura",
      publishedAt: "22 set 2026 • 09:12",
      imageSrc: "/globe.svg",
      imageAlt: "Ilustracao demonstrativa",
    },
    {
      slug: "redacao-fluxo-editorial",
      category: "Agricultura",
      title: "Redacao estrutura fluxo para acompanhar temas do campo e da producao local",
      summary: "Conteudo demonstrativo de apoio para composicao editorial da Home.",
      municipality: "Sao Miguel do Guapore",
      publishedAt: "22 set 2026 • 08:55",
    },
    {
      slug: "painel-categorias-publicas",
      category: "Policia",
      title: "Secao de seguranca publica recebe espaco neutro para futuras atualizacoes",
      summary: "Item demonstrativo sem fatos reais para validar densidade da coluna lateral de destaques.",
      municipality: "Alta Floresta d'Oeste",
      publishedAt: "22 set 2026 • 08:27",
    },
  ],
  latestNews: [
    {
      time: "09:42",
      category: "Politica",
      title: "Home passa a exibir hierarquia editorial com foco em leitura mobile",
      municipality: "Rolim de Moura",
      href: "/noticias/politica/home-com-hierarquia-editorial",
    },
    {
      time: "09:15",
      category: "Saude",
      title: "Estrutura de secoes prepara entradas para novos cadernos regionais",
      municipality: "Zona da Mata",
      href: "/noticias/saude/estrutura-de-secoes-regionais",
    },
    {
      time: "08:58",
      category: "Educacao",
      title: "Layout de noticias em ordem cronologica e validado para proximas etapas",
      href: "/noticias/educacao/layout-cronologico-validado",
    },
    {
      time: "08:30",
      category: "Economia",
      title: "Navegacao publica passa a integrar blocos editoriais da Home",
      municipality: "BR-429",
      href: "/noticias/economia/navegacao-publica-integrada",
    },
    {
      time: "08:02",
      category: "Cultura",
      title: "Componentes do design system sustentam crescimento do portal",
      href: "/noticias/cultura/componentes-sustentam-crescimento",
    },
  ],
  regionalNews: [
    {
      slug: "cobertura-zona-da-mata",
      category: "Noticias Locais",
      title: "Cobertura da Zona da Mata ganha bloco proprio na pagina inicial",
      summary: "Exemplo demonstrativo de materia regional com identificacao clara de municipio e contexto.",
      municipality: "Alta Floresta d'Oeste",
      publishedAt: "22 set 2026 • 07:45",
      imageSrc: "/window.svg",
      imageAlt: "Ilustracao demonstrativa de cobertura local",
    },
    {
      slug: "eixo-br-429",
      category: "Eventos",
      title: "Eixo da BR-429 entra na estrutura de destaque regional da Home",
      summary: "Conteudo ilustrativo para validar secao Nossa Regiao sem dependencia de dados externos.",
      municipality: "BR-429",
      publishedAt: "22 set 2026 • 07:18",
    },
    {
      slug: "municipios-em-evidencia",
      category: "Noticias Locais",
      title: "Pagina inicial passa a destacar links diretos para municipios",
      summary: "Demonstracao da estrategia regional para navegacao por localidade.",
      municipality: "Sao Miguel do Guapore",
      publishedAt: "22 set 2026 • 06:52",
    },
  ],
  categoryBlocks: [
    {
      id: "politica",
      title: "Politica",
      description: "Espaco editorial neutro para cobertura institucional e cidadania.",
      href: "/noticias/politica",
      stories: [
        {
          slug: "painel-editorial-politica",
          category: "Politica",
          title: "Secao de politica recebe estrutura pronta para curadoria futura",
          summary: "Modelo demonstrativo para futuras escolhas editoriais sem conteudo factual real.",
          municipality: "Rondonia",
          publishedAt: "22 set 2026 • 06:35",
        },
        {
          slug: "rotas-publicas-politica",
          category: "Politica",
          title: "Rotas publicas por categoria sao conectadas a blocos de destaque",
          summary: "Exemplo de item secundario para composicao da secao.",
          municipality: "Zona da Mata",
          publishedAt: "22 set 2026 • 06:10",
        },
      ],
    },
    {
      id: "agricultura",
      title: "Agricultura",
      description: "Area para temas de producao, tecnologia e rotina do campo regional.",
      href: "/noticias/agricultura",
      stories: [
        {
          slug: "caderno-campo",
          category: "Agricultura",
          title: "Home prepara caderno visual dedicado ao campo e a produtores",
          summary: "Conteudo ficticio e neutro para validar distribuicao de noticias por editoria.",
          municipality: "Rolim de Moura",
          publishedAt: "22 set 2026 • 05:48",
        },
        {
          slug: "tecnologia-rural",
          category: "Agricultura",
          title: "Estrutura suporta noticias sobre tecnologia aplicada ao setor rural",
          summary: "Item de demonstracao para visualizar variacao de titulos na mesma secao.",
          municipality: "Alta Floresta d'Oeste",
          publishedAt: "22 set 2026 • 05:21",
        },
      ],
    },
    {
      id: "policia",
      title: "Policia",
      description: "Bloco visual reservado para cobertura futura, sem relatos ficticios sensiveis.",
      href: "/noticias/policia",
      stories: [
        {
          slug: "secao-policia-neutra",
          category: "Policia",
          title: "Secao de policia foi preparada com linguagem editorial neutra",
          summary: "Exemplo propositalmente generico para validar layout sem criar narrativas indevidas.",
          municipality: "Sao Miguel do Guapore",
          publishedAt: "22 set 2026 • 05:02",
        },
      ],
    },
  ],
  municipalityLinks: [
    { name: "Rolim de Moura", href: "/municipios/rolim-de-moura" },
    { name: "Alta Floresta d'Oeste", href: "/municipios/alta-floresta-doeste" },
    { name: "Sao Miguel do Guapore", href: "/municipios/sao-miguel-do-guapore" },
    { name: "Alto Alegre dos Parecis", href: "/municipios/alto-alegre-dos-parecis" },
    { name: "Costa Marques", href: "/municipios/costa-marques" },
  ],
  jobsAndClassifiedsLinks: [
    {
      label: "Empregos",
      href: "/noticias/empregos",
      description: "Acesso rapido para oportunidades e informacoes de mercado de trabalho.",
    },
    {
      label: "Classificados",
      href: "/noticias/classificados",
      description: "Entrada editorial para classificados e servicos locais em evolucao futura.",
    },
  ],
  sidebarStories: [
    {
      slug: "estrutura-noticias-curtas",
      category: "Noticias Locais",
      title: "Formato de notas curtas preparado para atualizacoes ao longo do dia",
      summary: "Item demonstrativo para coluna lateral.",
      municipality: "BR-429",
      publishedAt: "22 set 2026 • 04:40",
    },
    {
      slug: "agenda-regional",
      category: "Eventos",
      title: "Bloco de agenda regional sera integrado com curadoria futura",
      summary: "Exemplo visual de chamada lateral.",
      municipality: "Zona da Mata",
      publishedAt: "22 set 2026 • 04:15",
    },
  ],
  adSlots: ["HOME_TOP", "HOME_MIDDLE", "SIDEBAR"],
};
