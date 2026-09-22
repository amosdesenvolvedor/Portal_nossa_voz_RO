export const USER_ROLES = ["ADMIN", "EDITOR", "AUTHOR"] as const;

export const NEWS_STATUS = [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export const AD_POSITIONS = [
  "HOME_TOP",
  "HOME_MIDDLE",
  "SIDEBAR",
  "ARTICLE_TOP",
  "ARTICLE_MIDDLE",
  "ARTICLE_BOTTOM",
  "CATEGORY_TOP",
] as const;

export const DEFAULT_NEWS_CATEGORIES = [
  "Noticias Locais",
  "Politica",
  "Policia",
  "Saude",
  "Educacao",
  "Esportes",
  "Economia",
  "Agricultura",
  "Cultura",
  "Eventos",
  "Empregos",
  "Classificados",
] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type NewsStatus = (typeof NEWS_STATUS)[number];
export type AdPosition = (typeof AD_POSITIONS)[number];