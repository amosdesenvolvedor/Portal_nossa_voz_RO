import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EditorialImagePlaceholder } from "@/components/ui/EditorialImagePlaceholder";
import { cn } from "@/lib/utils/cn";

type NewsCardProps = {
  title: string;
  summary: string;
  category: string;
  municipality: string;
  publishedAt: string;
  author?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function NewsCard({
  title,
  summary,
  category,
  municipality,
  publishedAt,
  author,
  href = "/noticias",
  imageSrc,
  imageAlt = "Imagem ilustrativa de noticia",
  className,
}: NewsCardProps) {
  return (
    <article className={cn("surface-card overflow-hidden", className)}>
      <div className="relative aspect-[16/9] w-full bg-surface-secondary">
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <EditorialImagePlaceholder label="Imagem de apoio" />
        )}
      </div>

      <div className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="category">{category}</Badge>
          <Badge variant="municipality">{municipality}</Badge>
        </div>

        <h3 className="text-h3">
          <Link href={href} className="text-text no-underline hover:text-brand-secondary focus-visible:rounded-sm">
            {title}
          </Link>
        </h3>

        <p className="text-body-sm text-text-muted">{summary}</p>

        <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
          <span>{publishedAt}</span>
          {author ? (
            <>
              <span aria-hidden>·</span>
              <span>{author}</span>
            </>
          ) : null}
        </footer>
      </div>
    </article>
  );
}