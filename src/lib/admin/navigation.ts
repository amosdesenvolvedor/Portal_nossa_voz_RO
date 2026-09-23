export type AdminNavItem = {
  label: string;
  href: string;
};

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Notícias", href: "/admin/noticias" },
  { label: "Revisão", href: "/admin/revisao" },
  { label: "Categorias", href: "/admin/categorias" },
  { label: "Municípios", href: "/admin/municipios" },
  { label: "Tags", href: "/admin/tags" },
  { label: "Autores", href: "/admin/autores" },
  { label: "Publicidade", href: "/admin/publicidade" },
  { label: "Configurações", href: "/admin/configuracoes" },
];
