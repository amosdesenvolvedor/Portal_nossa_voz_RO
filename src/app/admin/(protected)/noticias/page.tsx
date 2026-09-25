import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/Button";
import { requireAuthSession } from "@/lib/auth/session";
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
  const session = await requireAuthSession();
  const actor = { id: session.user.id, role: session.user.role };

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
    }, actor),
  ]);

  const currentParams = new URLSearchParams();
  if (query) {
    currentParams.set("q", query);
  }
  if (selectedMunicipality !== "all") {
    currentParams.set("municipio", selectedMunicipality);
  }
  if (selectedAuthor !== "all") {
    currentParams.set("autor", selectedAuthor);
  }

  function hrefForStatus(value: "all" | NewsStatus) {
    const next = new URLSearchParams(currentParams);
    if (value === "all") {
      next.delete("status");
    } else {
      next.set("status", value);
    }
    const suffix = next.toString();
    return suffix ? `/admin/noticias?${suffix}` : "/admin/noticias";
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notícias"
        description="Busque, filtre e abra rapidamente cada matéria para continuar a edição."
        actions={
          <Link href="/admin/noticias/nova" className="no-underline">
            <Button size="md">+ Nova notícia</Button>
          </Link>
        }
      />

      <section className="surface-card space-y-4 p-4" aria-label="Filtros de notícias">
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]" role="search" aria-label="Buscar notícias">
          <label className="space-y-1.5 text-body-sm font-semibold">
            Buscar notícias
            <input
              name="q"
              defaultValue={query}
              placeholder="Título, assunto ou palavra-chave"
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            />
          </label>
          <Button type="submit" className="md:self-end">
            Buscar
          </Button>

          <input type="hidden" name="status" value={selectedStatus} />
          <input type="hidden" name="municipio" value={selectedMunicipality} />
          <input type="hidden" name="autor" value={selectedAuthor} />
        </form>

        <div className="flex flex-wrap gap-2" aria-label="Filtros por status">
          {statusFilterOptions.map((option) => {
            const isActive = selectedStatus === option.value;

            return (
              <Link
                key={option.value}
                href={hrefForStatus(option.value)}
                className={`inline-flex min-h-11 items-center rounded-md border px-3 text-body-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "border-brand-primary bg-brand-primary text-text-inverse"
                    : "border-border bg-surface text-text hover:bg-surface-secondary"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        <details className="rounded-md border border-border bg-surface-secondary px-3 py-2">
          <summary className="cursor-pointer text-body-sm font-semibold">Filtros</summary>
          <form className="mt-3 grid gap-3 md:grid-cols-2">
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

            <input type="hidden" name="q" value={query} />
            <input type="hidden" name="status" value={selectedStatus} />

            <Button type="submit" className="md:col-span-2 md:justify-self-start">
              Aplicar filtros
            </Button>
          </form>
        </details>
      </section>

      <section className="surface-card p-3 md:p-4" aria-label="Lista de notícias">
        {filteredNews.items.length === 0 ? (
          <div className="rounded-md border border-border bg-surface-secondary px-4 py-5">
            <p className="text-body font-semibold">Nenhuma notícia encontrada.</p>
            <p className="mt-1 text-body-sm text-text-muted">Ajuste os filtros ou crie uma nova notícia.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredNews.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/noticias/${item.id}`}
                  className="block rounded-md border border-border bg-surface px-3 py-3 no-underline transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body font-semibold text-text">{item.title}</p>
                    <AdminStatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-body-sm text-text-muted">
                    {item.category} • {item.municipality}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
                    <span>Autor: {item.author}</span>
                    <span>Atualizada em {formatEditorialDateTimeLabel(item.updatedAtISO)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
