import type { ReactNode } from "react";

type EditorialEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EditorialEmptyState({ title, description, action }: EditorialEmptyStateProps) {
  return (
    <div className="surface-card border-dashed p-5 text-center md:p-7" role="status" aria-live="polite">
      <p className="text-h4">{title}</p>
      <p className="mt-2 text-body-sm text-text-muted">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}