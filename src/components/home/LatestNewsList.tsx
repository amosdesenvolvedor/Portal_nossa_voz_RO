import Link from "next/link";
import type { LatestItem } from "@/data/home-demo";

type LatestNewsListProps = {
  items: LatestItem[];
};

export function LatestNewsList({ items }: LatestNewsListProps) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={`${item.timeLabel}-${item.href}`}>
          <article className="grid grid-cols-[auto_1fr] gap-x-4 py-3 md:py-4">
            <time dateTime={item.publishedAtISO} className="pt-0.5 text-caption font-semibold text-brand-secondary">
              {item.timeLabel}
            </time>
            <div className="min-w-0 space-y-1">
              <p className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">{item.category}</p>
              <h3 className="text-h4">
                <Link href={item.href} className="text-text no-underline hover:text-brand-secondary">
                  {item.title}
                </Link>
              </h3>
              {item.municipality ? <p className="text-caption text-text-muted">{item.municipality}</p> : null}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
