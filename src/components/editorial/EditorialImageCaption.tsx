import { cn } from "@/lib/utils/cn";

type EditorialImageCaptionProps = {
  caption?: string;
  credit?: string;
  className?: string;
};

export function EditorialImageCaption({ caption, credit, className }: EditorialImageCaptionProps) {
  if (!caption && !credit) {
    return null;
  }

  return (
    <figcaption className={cn("text-caption text-text-muted", className)}>
      {caption ? <span>{caption}</span> : null}
      {caption && credit ? <span> • </span> : null}
      {credit ? <span>{credit}</span> : null}
    </figcaption>
  );
}