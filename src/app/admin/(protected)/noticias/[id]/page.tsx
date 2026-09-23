import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { getAdminNewsById } from "@/lib/services/editorial-service";

type AdminNewsDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminNewsDetailsPage({ params }: AdminNewsDetailsPageProps) {
  const resolvedParams = await params;
  const entry = await getAdminNewsById(resolvedParams.id);

  if (!entry) {
    notFound();
  }

  const authorName = entry.author?.name ?? entry.createdBy.name;
  const categoryName = entry.category?.name ?? "Sem categoria";
  const municipalityName = entry.municipality?.name ?? "Sem município";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Detalhes da notícia"
        description="Detalhe persistente da notícia por identificador."
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
            <dd>{categoryName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Autor</dt>
            <dd>{authorName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Município</dt>
            <dd>{municipalityName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Atualização</dt>
            <dd>{formatEditorialDateTimeLabel(entry.updatedAt)}</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
