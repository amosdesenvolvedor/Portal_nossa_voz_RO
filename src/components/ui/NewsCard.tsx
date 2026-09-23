import Image from "next/image";
import Link from "next/link";
import { EditorialMeta } from "@/components/editorial/EditorialMeta";
import { Badge } from "@/components/ui/Badge";
import { EditorialImagePlaceholder } from "@/components/ui/EditorialImagePlaceholder";
import { cn } from "@/lib/utils/cn";

type NewsCardVariant = "standard" | "horizontal" | "compact";

type NewsCardProps = {
  title: string;
  summary: string;
  category: string;
  municipality: string;
  publishedAt: string;
  publishedAtISO?: string;
  author?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  variant?: NewsCardVariant;
  className?: string;
};

export function NewsCard({
  title,
  summary,
  category,
  municipality,
  publishedAt,
  publishedAtISO,
  author,
  href = "/noticias",
  imageSrc,
  imageAlt = "Imagem ilustrativa de noticia",
  variant = "standard",
  className,
}: NewsCardProps) {
  const isHorizontal = variant === "horizontal";
  const isCompact = variant === "compact";

  return (
    <article
      className={cn(
        "surface-card min-w-0 overflow-hidden",
        isHorizontal ? "md:grid md:grid-cols-[220px_minmax(0,1fr)]" : undefined,
        className,
      )}
    >
      {!isCompact ? (
        <div className={cn("relative w-full bg-surface-secondary", isHorizontal ? "h-full min-h-[170px]" : "aspect-[16/9]")}>
          {imageSrc ? (
            <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <EditorialImagePlaceholder label="Imagem de apoio" />
          )}
        </div>
      ) : null}

      <div className={cn("min-w-0 space-y-4 p-4 md:p-5", isCompact ? "space-y-3" : undefined)}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="category">{category}</Badge>
          <Badge variant="municipality">{municipality}</Badge>
        </div>

        <h3 className="text-h3 break-words">
          <Link href={href} className="text-text no-underline hover:text-brand-secondary focus-visible:rounded-sm">
            {title}
          </Link>
        </h3>

        {!isCompact ? <p className="break-words text-body-sm text-text-muted">{summary}</p> : null}

        <EditorialMeta publishedAtLabel={publishedAt} publishedAtISO={publishedAtISO} author={author} />
      </div>
    </article>
  );
}