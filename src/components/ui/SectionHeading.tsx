import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  actions,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-h2">{title}</h2>
        {subtitle ? <p className="max-w-reading text-body-sm text-text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}