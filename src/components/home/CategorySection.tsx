import Link from "next/link";
import { NewsCard } from "@/components/ui/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CategoryBlock } from "@/data/home-demo";
import { buildNewsHref } from "@/lib/editorial/urls";

type CategorySectionProps = {
  block: CategoryBlock;
};

export function CategorySection({ block }: CategorySectionProps) {
  if (block.stories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        title={block.title}
        subtitle={block.description}
        actions={
          <Link href={block.href} className="text-body-sm font-semibold">
            Ver editoria
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {block.stories.slice(0, 2).map((story) => (
          <NewsCard
            key={story.slug}
            href={buildNewsHref(story.category, story.slug)}
            title={story.title}
            summary={story.summary}
            category={story.category}
            municipality={story.municipality}
            publishedAt={story.publishedAt}
            publishedAtISO={story.publishedAtISO}
            imageSrc={story.imageSrc}
            imageAlt={story.imageAlt}
          />
        ))}
      </div>
    </section>
  );
}
