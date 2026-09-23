import { DEFAULT_NEWS_CATEGORIES } from "@/lib/domain/editorial";

export type NavItem = {
  label: string;
  href: string;
};

export type CategoryNavItem = NavItem & {
  slug: string;
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function toUrlSlug(input: string): string {
  return slugify(input);
}

const categoryLabelMap: Record<string, string> = {
  "Noticias Locais": "Notícias locais",
  Politica: "Política",
  Policia: "Polícia",
  Saude: "Saúde",
  Educacao: "Educação",
  Esportes: "Esportes",
  Economia: "Economia",
  Agricultura: "Agricultura",
  Cultura: "Cultura",
  Eventos: "Eventos",
  Empregos: "Empregos",
  Classificados: "Classificados",
};

function toDisplayCategoryLabel(category: string): string {
  return categoryLabelMap[category] ?? category;
}

const categoryNavigation: CategoryNavItem[] = DEFAULT_NEWS_CATEGORIES.map((category) => {
  const slug = slugify(category);

  return {
    label: toDisplayCategoryLabel(category),
    slug,
    href: `/noticias/${slug}`,
  };
});

export const SITE_CONFIG = {
  name: "Nossa Voz RO",
  slogan: "A VOZ DE QUEM VIVE AQUI",
  description: "Portal jornalistico regional de Rondonia.",
  applicationName: "Nossa Voz RO",
  logo: {
    src: "/brand/nossa-voz-ro.png",
    alt: "Nossa Voz RO",
    width: 1200,
    height: 400,
  },
} as const;

export const MAIN_NAVIGATION: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Municípios", href: "/municipios" },
  { label: "Autores", href: "/autores" },
  { label: "Busca", href: "/busca" },
];

export const INSTITUTIONAL_NAVIGATION: NavItem[] = [
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Publicidade", href: "/publicidade" },
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
];

export const FEATURED_MUNICIPALITY_NAVIGATION: NavItem[] = [
  { label: "Rolim de Moura", href: "/municipios/rolim-de-moura" },
  { label: "Alta Floresta d'Oeste", href: "/municipios/alta-floresta-doeste" },
  { label: "São Miguel do Guaporé", href: "/municipios/sao-miguel-do-guapore" },
];

export const CATEGORY_NAVIGATION = categoryNavigation;

export function getCategoryBySlug(slug: string): CategoryNavItem | undefined {
  return CATEGORY_NAVIGATION.find((category) => category.slug === slug);
}

export function titleFromSlug(slug: string): string {
  const words = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return words.join(" ");
}

// Temporary navigation source for Prompt 03.
// Future prompts should replace or hydrate this from database-backed categories and regions.
