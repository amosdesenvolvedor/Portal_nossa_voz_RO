import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { listReviewQueue } from "@/lib/services/editorial-service";
import Link from "next/link";

export default async function AdminReviewQueuePage() {
  const queue = await listReviewQueue();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Revisão editorial"
        description="Pendências que aguardam revisão humana antes da publicação."
      />

      <section className="surface-card p-4 md:p-5">
        {queue.length === 0 ? (
          <div className="rounded-md border border-border bg-surface-secondary px-4 py-5">
            <p className="text-body font-semibold">Nenhuma notícia aguardando revisão.</p>
            <p className="mt-1 text-body-sm text-text-muted">
              Quando uma notícia for enviada para revisão, ela aparecerá aqui.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Itens em revisão">
            {queue.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/noticias/${item.id}`}
                  className="block rounded-md border border-border bg-surface px-3 py-3 no-underline transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <AdminStatusBadge status={item.status} />
                    <p className="text-caption text-text-muted">Atualizada em {formatEditorialDateTimeLabel(item.updatedAtISO)}</p>
                  </div>
                  <p className="mt-1 text-body font-semibold">{item.title}</p>
                  <p className="text-body-sm text-text-muted">
                    {item.category} • {item.author} • {item.municipality}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
