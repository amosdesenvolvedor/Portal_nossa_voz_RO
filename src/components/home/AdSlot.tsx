import type { AdPosition } from "@/lib/domain/editorial";
import { cn } from "@/lib/utils/cn";

type AdSlotProps = {
  position: AdPosition;
  className?: string;
};

export function AdSlot({ position, className }: AdSlotProps) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return (
    <aside
      aria-label={`Espaço publicitário ${position}`}
      className={cn(
        "surface-card border-dashed px-4 py-2.5 text-center md:py-3",
        "text-caption uppercase tracking-[0.08em] text-text-muted",
        className,
      )}
    >
      <p className="font-semibold text-brand-secondary">Publicidade</p>
      <p className="mt-1">Espaço publicitário</p>
      {isDevelopment ? <p className="mt-1 normal-case tracking-normal">Posição: {position}</p> : null}
    </aside>
  );
}
