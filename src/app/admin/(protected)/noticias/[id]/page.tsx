import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ADMIN_DEMO_NEWS } from "@/data/admin-demo";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";

type AdminNewsDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminNewsDetailsPage({ params }: AdminNewsDetailsPageProps) {
  const resolvedParams = await params;
  const entry = ADMIN_DEMO_NEWS.find((item) => item.id === resolvedParams.id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Detalhes da notícia"
        description="Página estrutural para futura edição persistente por ID no Prompt 09."
      />

      <article className="surface-card space-y-3 p-5">
        <AdminStatusBadge status={entry.status} />
        <h2 className="text-h3">{entry.title}</h2>
        <dl className="grid gap-2 text-body-sm">
          <div>
            <dt className="font-semibold">Slug</dt>
            <dd>/{entry.slug}</dd>
          </div>
          <div>
            <dt className="font-semibold">Categoria</dt>
            <dd>{entry.category}</dd>
          </div>
          <div>
            <dt className="font-semibold">Autor</dt>
            <dd>{entry.author}</dd>
          </div>
          <div>
            <dt className="font-semibold">Município</dt>
            <dd>{entry.municipality}</dd>
          </div>
          <div>
            <dt className="font-semibold">Atualização</dt>
            <dd>{formatEditorialDateTimeLabel(entry.updatedAtISO)}</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
