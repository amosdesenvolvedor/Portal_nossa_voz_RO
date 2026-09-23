import { cn } from "@/lib/utils/cn";

type EditorialImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export function EditorialImagePlaceholder({
  className,
  label = "Imagem editorial demonstrativa",
}: EditorialImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "bg-[linear-gradient(140deg,var(--color-surface-secondary)_0%,var(--color-canvas)_100%)]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(7,91,73,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(23,51,45,0.08)_100%)]" />
      <div className="absolute bottom-3 left-3 rounded-sm border border-border/70 bg-surface/85 px-2 py-1 text-caption font-medium text-text-muted">
        {label}
      </div>
    </div>
  );
}
