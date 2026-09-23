import type { NewsStatus, UserRole } from "@/lib/domain/editorial";

export const PUBLISHER_ROLES: UserRole[] = ["EDITOR", "ADMIN"];

const TRANSITIONS: Record<NewsStatus, NewsStatus[]> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["DRAFT", "PUBLISHED"],
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

const TRANSITION_ROLES: Partial<Record<`${NewsStatus}->${NewsStatus}`, UserRole[]>> = {
  "DRAFT->IN_REVIEW": ["AUTHOR", "EDITOR", "ADMIN"],
  "IN_REVIEW->DRAFT": ["EDITOR", "ADMIN"],
  "IN_REVIEW->PUBLISHED": ["EDITOR", "ADMIN"],
  "PUBLISHED->ARCHIVED": ["EDITOR", "ADMIN"],
  "ARCHIVED->DRAFT": ["EDITOR", "ADMIN"],
};

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  DRAFT: "Rascunho",
  IN_REVIEW: "Em revisão",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

export function canAccessAdmin(role: UserRole): boolean {
  return ["AUTHOR", "EDITOR", "ADMIN"].includes(role);
}

export function canUseEditorialAi(role: UserRole): boolean {
  return ["AUTHOR", "EDITOR", "ADMIN"].includes(role);
}

export function canPublish(role: UserRole): boolean {
  return PUBLISHER_ROLES.includes(role);
}

export function getAllowedNextStatuses(role: UserRole, currentStatus: NewsStatus): NewsStatus[] {
  return TRANSITIONS[currentStatus].filter((targetStatus) => {
    const key = `${currentStatus}->${targetStatus}` as const;
    return TRANSITION_ROLES[key]?.includes(role) ?? false;
  });
}

export function canTransitionStatus(role: UserRole, from: NewsStatus, to: NewsStatus): boolean {
  const key = `${from}->${to}` as const;
  return TRANSITION_ROLES[key]?.includes(role) ?? false;
}
