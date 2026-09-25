import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({ title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-h2">{title}</h1>
          <p className="max-w-reading text-body-sm text-text-muted">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
