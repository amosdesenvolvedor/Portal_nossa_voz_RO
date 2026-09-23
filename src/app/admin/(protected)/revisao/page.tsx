import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { listReviewQueue } from "@/lib/services/editorial-service";

export default async function AdminReviewQueuePage() {
  const queue = await listReviewQueue();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Fila de revisão"
        description="Itens em revisão para análise editorial humana antes de qualquer publicação."
      />

      <section className="surface-card p-4 md:p-5">
        {queue.length === 0 ? (
          <p className="text-body-sm text-text-muted">Nenhum item em revisão no momento.</p>
        ) : (
          <ul className="space-y-3">
            {queue.map((item) => (
              <li key={item.id} className="rounded-md border border-border bg-surface-secondary p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge status={item.status} />
                  <p className="text-caption text-text-muted">Atualizada em {formatEditorialDateTimeLabel(item.updatedAtISO)}</p>
                </div>
                <p className="mt-1 text-body font-semibold">{item.title}</p>
                <p className="text-body-sm text-text-muted">
                  {item.category} • {item.author} • {item.municipality}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
