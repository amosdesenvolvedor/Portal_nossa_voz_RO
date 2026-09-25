import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { requireAuthSession } from "@/lib/auth/session";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { getAdminNewsStatusCounts, listAdminNews } from "@/lib/services/editorial-service";

export default async function AdminDashboardPage() {
  const session = await requireAuthSession();
  const actor = { id: session.user.id, role: session.user.role };

  const [counts, recent] = await Promise.all([
    getAdminNewsStatusCounts(),
    listAdminNews({ page: 1, pageSize: 4 }, actor),
  ]);

  const draftCount = counts.DRAFT;
  const reviewCount = counts.IN_REVIEW;
  const publishedCount = counts.PUBLISHED;
  const firstName = (session.user.name || "Editor").trim().split(" ")[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Olá, ${firstName}.`}
        description="O que você quer fazer agora?"
        actions={
          <Link href="/admin/noticias/nova" className="no-underline">
            <Button size="md">+ Criar nova notícia</Button>
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Resumo de status">
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="DRAFT" />
          <p className="text-h2">{draftCount}</p>
          <p className="text-body-sm text-text-muted">Rascunhos para continuar</p>
        </article>
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="IN_REVIEW" />
          <p className="text-h2">{reviewCount}</p>
          <p className="text-body-sm text-text-muted">Aguardando revisão</p>
        </article>
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="PUBLISHED" />
          <p className="text-h2">{publishedCount}</p>
          <p className="text-body-sm text-text-muted">Publicadas recentemente</p>
        </article>
      </section>

      <section className="surface-card p-4 md:p-5" aria-labelledby="admin-recentes-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="admin-recentes-title" className="text-h3">
            Rascunhos e itens recentes
          </h2>
          <Link href="/admin/noticias" className="text-body-sm font-semibold">
            Ver todas
          </Link>
        </div>
        <Divider className="my-3" />
        {recent.items.length === 0 ? (
          <p className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-body-sm text-text-muted">
            Nenhuma notícia recente. Crie a primeira matéria para iniciar o fluxo editorial.
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.items.map((item) => (
              <li key={item.id} className="rounded-sm border border-border bg-surface-secondary p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <AdminStatusBadge status={item.status} />
                  <p className="text-caption text-text-muted">Atualizada em {formatEditorialDateTimeLabel(item.updatedAtISO)}</p>
                </div>
                <p className="mt-1 text-body font-semibold">{item.title}</p>
                <p className="text-body-sm text-text-muted">
                  {item.category} • {item.municipality} • {item.author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
