import { cn } from "@/lib/utils/cn";

type EditorialMetaProps = {
  publishedAtLabel: string;
  publishedAtISO?: string;
  municipality?: string;
  author?: string;
  className?: string;
};

export function EditorialMeta({
  publishedAtLabel,
  publishedAtISO,
  municipality,
  author,
  className,
}: EditorialMetaProps) {
  const hasSecondaryMeta = Boolean(municipality || author);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-text-muted", className)}>
      <time dateTime={publishedAtISO}>{publishedAtLabel}</time>
      {hasSecondaryMeta ? <span aria-hidden>•</span> : null}
      {municipality ? <span>{municipality}</span> : null}
      {municipality && author ? <span aria-hidden>•</span> : null}
      {author ? <span>{author}</span> : null}
    </div>
  );
}