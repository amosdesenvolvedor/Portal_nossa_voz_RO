import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import type { EditorialContentBlock } from "@/lib/editorial/article-blocks";
import type { DemoStory, LatestItem } from "@/data/home-demo";

type PersistedNewsLike = {
  slug: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  heroImageCaption?: string | null;
  heroImageCredit?: string | null;
  content?: string;
  contentBlocks?: unknown;
  category?: { name: string; slug: string } | null;
  municipality?: { name: string; slug: string } | null;
  region?: { name: string; slug: string } | null;
  author?: { name: string | null } | null;
  createdBy?: { name: string | null } | null;
  tags?: Array<{ name: string; slug: string }>;
};

export function toDemoStory(news: PersistedNewsLike): DemoStory {
  const publishedAtISO = (news.publishedAt ?? news.updatedAt).toISOString();

  return {
    slug: news.slug,
    category: news.category?.name ?? "Sem categoria",
    title: news.title,
    summary: news.summary ?? "Matéria sem subtítulo nesta versão.",
    municipality: news.municipality?.name ?? "Rondônia",
    publishedAt: formatEditorialDateTimeLabel(publishedAtISO),
    publishedAtISO,
    author: news.author?.name ?? news.createdBy?.name ?? "Redação",
    imageSrc: news.heroImageUrl ?? undefined,
    imageAlt: news.heroImageAlt ?? undefined,
  };
}

export function toLatestNewsItem(news: PersistedNewsLike): LatestItem {
  const publishedAtISO = (news.publishedAt ?? news.updatedAt).toISOString();
  const date = new Date(publishedAtISO);
  const timeLabel = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Porto_Velho",
  });

  return {
    timeLabel,
    publishedAtISO,
    category: news.category?.name ?? "Sem categoria",
    title: news.title,
    municipality: news.municipality?.name ?? undefined,
    href: `/noticias/${news.category?.slug ?? "noticias"}/${news.slug}`,
  };
}

export function toEditorialBlocks(news: PersistedNewsLike): EditorialContentBlock[] {
  const blocks = news.contentBlocks;

  if (Array.isArray(blocks) && blocks.length > 0) {
    return blocks as EditorialContentBlock[];
  }

  if (news.content?.trim()) {
    return [
      {
        type: "paragraph",
        content: [{ type: "text", text: news.content.trim() }],
      },
    ];
  }

  return [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Conteúdo editorial indisponível." }],
    },
  ];
}

export function toEditorialTags(news: PersistedNewsLike) {
  return (news.tags ?? []).map((tag) => ({
    label: tag.name,
    href: `/noticias/${tag.slug}`,
  }));
}
