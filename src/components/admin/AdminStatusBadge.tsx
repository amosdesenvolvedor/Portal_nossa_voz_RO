import type { NewsStatus } from "@/lib/domain/editorial";
import { NEWS_STATUS_LABELS } from "@/lib/auth/policies";
import { cn } from "@/lib/utils/cn";

type AdminStatusBadgeProps = {
  status: NewsStatus;
  className?: string;
};

const statusClasses: Record<NewsStatus, string> = {
  DRAFT: "border border-border bg-surface-secondary text-text",
  IN_REVIEW: "border border-semantic-info/30 bg-semantic-info/10 text-semantic-info",
  PUBLISHED: "border border-semantic-success/35 bg-semantic-success/10 text-semantic-success",
  ARCHIVED: "border border-border-strong bg-surface text-text-muted",
};

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.08em]",
        statusClasses[status],
        className,
      )}
      aria-label={`Status: ${NEWS_STATUS_LABELS[status]}`}
    >
      {NEWS_STATUS_LABELS[status]}
    </span>
  );
}
