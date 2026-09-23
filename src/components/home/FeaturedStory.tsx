import Image from "next/image";
import Link from "next/link";
import { EditorialMeta } from "@/components/editorial/EditorialMeta";
import { Badge } from "@/components/ui/Badge";
import { EditorialImagePlaceholder } from "@/components/ui/EditorialImagePlaceholder";
import type { DemoStory } from "@/data/home-demo";
import { buildNewsHref } from "@/lib/editorial/urls";

type FeaturedStoryProps = {
  story: DemoStory;
};

export function FeaturedStory({ story }: FeaturedStoryProps) {
  return (
    <article className="surface-card min-w-0 overflow-hidden">
      <div className="relative aspect-[16/9] w-full bg-surface-secondary">
        {story.imageSrc ? (
          <Image
            src={story.imageSrc}
            alt={story.imageAlt ?? "Imagem de destaque demonstrativa"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        ) : (
          <EditorialImagePlaceholder label="Destaque editorial" />
        )}
      </div>

      <div className="min-w-0 space-y-4 p-5 md:p-7">
        <header className="space-y-3">
          <Badge variant="category">{story.category}</Badge>
          <h2 className="text-h1 break-words">
            <Link
              href={buildNewsHref(story.category, story.slug)}
              className="text-text no-underline hover:text-brand-secondary"
            >
              {story.title}
            </Link>
          </h2>
          <p className="break-words text-body-lg text-text-muted">{story.summary}</p>
        </header>

        <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-text-muted">
          <Badge variant="municipality">{story.municipality}</Badge>
          <span aria-hidden>•</span>
          <EditorialMeta publishedAtLabel={story.publishedAt} publishedAtISO={story.publishedAtISO} />
        </footer>
      </div>
    </article>
  );
}
