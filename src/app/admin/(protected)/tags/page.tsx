import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listTags } from "@/lib/services/editorial-service";

export default async function AdminTagsPage() {
  const tags = await listTags();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tags"
        description="Taxonomia editorial persistida no banco para classificação de conteúdo."
      />

      <section className="surface-card p-4 md:p-5">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <li key={tag.id} className="rounded-md border border-border bg-surface-secondary px-3 py-2">
              <p className="font-semibold">{tag.name}</p>
              <p className="text-caption text-text-muted">/{tag.slug}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
