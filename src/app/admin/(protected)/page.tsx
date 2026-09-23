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
  const archivedCount = counts.ARCHIVED;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard editorial"
        description="Visão operacional inicial do fluxo de notícias. Números desta tela são demonstrativos nesta etapa."
        actions={
          <Link href="/admin/noticias/nova" className="no-underline">
            <Button size="md">Nova notícia</Button>
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo de status">
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="DRAFT" />
          <p className="text-h2">{draftCount}</p>
          <p className="text-body-sm text-text-muted">Itens em rascunho</p>
        </article>
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="IN_REVIEW" />
          <p className="text-h2">{reviewCount}</p>
          <p className="text-body-sm text-text-muted">Itens aguardando revisão</p>
        </article>
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="PUBLISHED" />
          <p className="text-h2">{publishedCount}</p>
          <p className="text-body-sm text-text-muted">Itens publicados</p>
        </article>
        <article className="surface-card space-y-2 p-4">
          <AdminStatusBadge status="ARCHIVED" />
          <p className="text-h2">{archivedCount}</p>
          <p className="text-body-sm text-text-muted">Itens arquivados</p>
        </article>
      </section>

      <section className="surface-card p-4 md:p-5" aria-labelledby="admin-recentes-title">
        <h2 id="admin-recentes-title" className="text-h3">
          Conteúdos recentes
        </h2>
        <Divider className="my-3" />
        <ul className="space-y-3">
          {recent.items.map((item) => (
            <li key={item.id} className="rounded-sm border border-border bg-surface-secondary p-3">
              <div className="flex flex-wrap items-center gap-2">
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
      </section>
    </div>
  );
}
