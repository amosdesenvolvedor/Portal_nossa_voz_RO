import type { AdPosition } from "@/lib/domain/editorial";
import { cn } from "@/lib/utils/cn";

type AdSlotProps = {
  position: AdPosition;
  className?: string;
};

export function AdSlot({ position, className }: AdSlotProps) {
  return (
    <aside
      aria-label={`Espaco publicitario ${position}`}
      className={cn(
        "surface-card border-dashed p-4 text-center",
        "text-caption uppercase tracking-[0.08em] text-text-muted",
        className,
      )}
    >
      <p className="font-semibold text-brand-secondary">Publicidade</p>
      <p className="mt-1">Espaco publicitario</p>
      <p className="mt-1 normal-case tracking-normal">Posicao: {position}</p>
    </aside>
  );
}
