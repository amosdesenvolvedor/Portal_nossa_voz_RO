export type AdminNavItem = {
  label: string;
  href: string;
  group: "core" | "taxonomy" | "system";
  featured?: boolean;
};

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  { label: "Painel", href: "/admin", group: "core" },
  { label: "Notícias", href: "/admin/noticias", group: "core" },
  { label: "Nova notícia", href: "/admin/noticias/nova", group: "core", featured: true },
  { label: "Revisão", href: "/admin/revisao", group: "core" },
  { label: "Categorias", href: "/admin/categorias", group: "taxonomy" },
  { label: "Municípios", href: "/admin/municipios", group: "taxonomy" },
  { label: "Tags", href: "/admin/tags", group: "taxonomy" },
  { label: "Autores", href: "/admin/autores", group: "taxonomy" },
  { label: "Publicidade", href: "/admin/publicidade", group: "system" },
  { label: "Configurações", href: "/admin/configuracoes", group: "system" },
];
