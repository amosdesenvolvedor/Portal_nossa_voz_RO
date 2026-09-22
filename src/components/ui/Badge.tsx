import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "category" | "municipality" | "tag" | "status";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  category: "bg-brand-primary text-text-inverse",
  municipality: "bg-brand-accentLight text-text",
  tag: "bg-surface-secondary text-brand-secondary border border-border",
  status: "bg-semantic-info/12 text-semantic-info border border-semantic-info/20",
};

export function Badge({ children, variant = "tag", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.08em]",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}