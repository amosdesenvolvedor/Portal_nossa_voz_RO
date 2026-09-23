import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type EditorialPaginationProps = {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

export function EditorialPagination({
  currentPage,
  totalPages,
  hrefForPage,
  className,
}: EditorialPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginacao" className={cn("flex flex-wrap items-center gap-2", className)}>
      {safePage > 1 ? (
        <Link
          href={hrefForPage(safePage - 1)}
          className="inline-flex h-9 items-center rounded-sm border border-border px-3 text-body-sm font-semibold no-underline text-text hover:bg-surface-secondary"
        >
          Anterior
        </Link>
      ) : null}

      <ul className="flex flex-wrap items-center gap-2">
        {pages.map((page) => {
          const isCurrent = page === safePage;

          return (
            <li key={page}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-sm border border-brand-primary bg-brand-primary px-2 text-body-sm font-semibold text-text-inverse"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={hrefForPage(page)}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-sm border border-border px-2 text-body-sm font-semibold no-underline text-text hover:bg-surface-secondary"
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {safePage < totalPages ? (
        <Link
          href={hrefForPage(safePage + 1)}
          className="inline-flex h-9 items-center rounded-sm border border-border px-3 text-body-sm font-semibold no-underline text-text hover:bg-surface-secondary"
        >
          Proxima
        </Link>
      ) : null}
    </nav>
  );
}