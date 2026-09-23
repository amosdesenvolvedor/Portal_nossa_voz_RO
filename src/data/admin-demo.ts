import type { NewsStatus } from "@/lib/domain/editorial";

export type AdminDemoNews = {
  id: string;
  title: string;
  slug: string;
  status: NewsStatus;
  category: string;
  author: string;
  municipality: string;
  updatedAtISO: string;
};

export type AdminDemoCategory = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type AdminDemoMunicipality = {
  id: string;
  name: string;
  slug: string;
  region: string;
  isActive: boolean;
  featured: boolean;
};

export type AdminDemoTag = {
  id: string;
  name: string;
  slug: string;
};

export type AdminDemoAuthor = {
  id: string;
  name: string;
  roleLabel: string;
  email: string;
};

export const ADMIN_DEMO_NEWS: AdminDemoNews[] = [
  {
    id: "demo-001",
    title: "Portal organiza editoria municipal para cobertura contínua",
    slug: "portal-organiza-editoria-municipal",
    status: "DRAFT",
    category: "Notícias locais",
    author: "Equipe Redação",
    municipality: "Rolim de Moura",
    updatedAtISO: "2026-09-22T09:40:00-04:00",
  },
  {
    id: "demo-002",
    title: "Equipe revisa pauta de saúde com dados oficiais consolidados",
    slug: "equipe-revisa-pauta-de-saude",
    status: "IN_REVIEW",
    category: "Saúde",
    author: "Editor Regional",
    municipality: "São Miguel do Guaporé",
    updatedAtISO: "2026-09-22T10:10:00-04:00",
  },
  {
    id: "demo-003",
    title: "Nova estrutura de categorias melhora leitura por tema",
    slug: "nova-estrutura-de-categorias",
    status: "PUBLISHED",
    category: "Política",
    author: "Editor Regional",
    municipality: "Alta Floresta d'Oeste",
    updatedAtISO: "2026-09-21T15:20:00-04:00",
  },
  {
    id: "demo-004",
    title: "Arquivo de cobertura antiga migra para trilha de histórico",
    slug: "arquivo-de-cobertura-antiga",
    status: "ARCHIVED",
    category: "Cultura",
    author: "Equipe Redação",
    municipality: "Pimenta Bueno",
    updatedAtISO: "2026-09-19T11:45:00-04:00",
  },
  {
    id: "demo-005",
    title: "Rascunho de pauta agrícola aguarda atualização de campo",
    slug: "rascunho-pauta-agricola",
    status: "DRAFT",
    category: "Agricultura",
    author: "Repórter Local",
    municipality: "Santa Luzia d'Oeste",
    updatedAtISO: "2026-09-22T08:20:00-04:00",
  },
];

export const ADMIN_DEMO_CATEGORIES: AdminDemoCategory[] = [
  { id: "cat-1", name: "Notícias locais", slug: "noticias-locais", isActive: true },
  { id: "cat-2", name: "Política", slug: "politica", isActive: true },
  { id: "cat-3", name: "Saúde", slug: "saude", isActive: true },
  { id: "cat-4", name: "Agricultura", slug: "agricultura", isActive: true },
  { id: "cat-5", name: "Eventos", slug: "eventos", isActive: false },
];

export const ADMIN_DEMO_MUNICIPALITIES: AdminDemoMunicipality[] = [
  { id: "mun-1", name: "Rolim de Moura", slug: "rolim-de-moura", region: "Zona da Mata", isActive: true, featured: true },
  {
    id: "mun-2",
    name: "Alta Floresta d'Oeste",
    slug: "alta-floresta-doeste",
    region: "Zona da Mata",
    isActive: true,
    featured: true,
  },
  {
    id: "mun-3",
    name: "São Miguel do Guaporé",
    slug: "sao-miguel-do-guapore",
    region: "Zona da Mata",
    isActive: true,
    featured: true,
  },
  { id: "mun-4", name: "Pimenta Bueno", slug: "pimenta-bueno", region: "Cone Sul", isActive: true, featured: false },
  { id: "mun-5", name: "Ji-Paraná", slug: "ji-parana", region: "Central", isActive: true, featured: false },
];

export const ADMIN_DEMO_TAGS: AdminDemoTag[] = [
  { id: "tag-1", name: "Zona da Mata", slug: "zona-da-mata" },
  { id: "tag-2", name: "Jornalismo regional", slug: "jornalismo-regional" },
  { id: "tag-3", name: "Cobertura local", slug: "cobertura-local" },
  { id: "tag-4", name: "Serviço público", slug: "servico-publico" },
];

export const ADMIN_DEMO_AUTHORS: AdminDemoAuthor[] = [
  { id: "auth-1", name: "Equipe Redação", roleLabel: "EDITOR", email: "equipe.redacao@example.invalid" },
  { id: "auth-2", name: "Repórter Local", roleLabel: "AUTHOR", email: "reporter.local@example.invalid" },
  { id: "auth-3", name: "Editor Regional", roleLabel: "EDITOR", email: "editor.regional@example.invalid" },
];

export function getAdminNewsByStatus(status: NewsStatus) {
  return ADMIN_DEMO_NEWS.filter((item) => item.status === status);
}
