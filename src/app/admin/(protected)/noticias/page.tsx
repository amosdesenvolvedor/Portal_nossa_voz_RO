import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/Button";
import type { NewsStatus } from "@/lib/domain/editorial";
import { formatEditorialDateTimeLabel } from "@/lib/editorial/date";
import { listAdminNews, listAdminReferenceData } from "@/lib/services/editorial-service";

type AdminNewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusFilterOptions: Array<{ label: string; value: "all" | NewsStatus }> = [
  { label: "Todos", value: "all" },
  { label: "Rascunho", value: "DRAFT" },
  { label: "Em revisão", value: "IN_REVIEW" },
  { label: "Publicado", value: "PUBLISHED" },
  { label: "Arquivado", value: "ARCHIVED" },
];

export default async function AdminNewsPage({ searchParams }: AdminNewsPageProps) {
  const params = await searchParams;
  const selectedStatus = typeof params.status === "string" ? params.status : "all";
  const selectedMunicipality = typeof params.municipio === "string" ? params.municipio : "all";
  const selectedAuthor = typeof params.autor === "string" ? params.autor : "all";
  const query = typeof params.q === "string" ? params.q : "";

  const [referenceData, filteredNews] = await Promise.all([
    listAdminReferenceData(),
    listAdminNews({
      page: 1,
      pageSize: 50,
      status: selectedStatus === "all" ? undefined : (selectedStatus as NewsStatus),
      municipalitySlug: selectedMunicipality === "all" ? undefined : selectedMunicipality,
      authorId: selectedAuthor === "all" ? undefined : selectedAuthor,
      q: query || undefined,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notícias"
        description="Listagem administrativa inicial com filtros visuais e estrutura preparada para persistência real."
        actions={
          <Link href="/admin/noticias/nova" className="no-underline">
            <Button size="md">Nova notícia</Button>
          </Link>
        }
      />

      <section className="surface-card space-y-4 p-4" aria-label="Filtros de notícias">
        <form className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1.5 text-body-sm font-semibold">
            Status
            <select name="status" defaultValue={selectedStatus} className="h-11 w-full rounded-md border border-border bg-surface px-3">
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-body-sm font-semibold">
            Município
            <select
              name="municipio"
              defaultValue={selectedMunicipality}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            >
              <option value="all">Todos</option>
              {referenceData.municipalities.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-body-sm font-semibold">
            Autor
            <select name="autor" defaultValue={selectedAuthor} className="h-11 w-full rounded-md border border-border bg-surface px-3">
              <option value="all">Todos</option>
              {referenceData.authors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-1.5 text-body-sm font-semibold">
            <span>Busca por título</span>
            <input
              name="q"
              defaultValue={query}
              placeholder="Digite parte do título"
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            />
          </div>

          <Button type="submit" className="md:col-span-4 md:justify-self-start">
            Aplicar filtros
          </Button>
        </form>
      </section>

      <section className="surface-card overflow-hidden" aria-label="Lista de notícias">
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full divide-y divide-border text-left text-body-sm">
            <thead className="bg-surface-secondary text-caption uppercase tracking-[0.08em] text-text-muted">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3">Atualização</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredNews.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-caption text-text-muted">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.author}</td>
                  <td className="px-4 py-3">{item.municipality}</td>
                  <td className="px-4 py-3">{formatEditorialDateTimeLabel(item.updatedAtISO)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/noticias/${item.id}`} className="text-body-sm font-semibold">
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="grid gap-3 p-3 lg:hidden">
              {filteredNews.items.map((item) => (
            <li key={item.id} className="rounded-md border border-border bg-surface p-3">
              <div className="flex flex-wrap items-center gap-2">
                <AdminStatusBadge status={item.status} />
                <span className="text-caption text-text-muted">{formatEditorialDateTimeLabel(item.updatedAtISO)}</span>
              </div>
              <p className="mt-2 text-body font-semibold">{item.title}</p>
              <p className="mt-1 text-body-sm text-text-muted">
                {item.category} • {item.author} • {item.municipality}
              </p>
              <Link href={`/admin/noticias/${item.id}`} className="mt-2 inline-flex min-h-11 items-center text-body-sm font-semibold">
                Abrir matéria
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
