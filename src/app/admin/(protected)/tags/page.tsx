import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ADMIN_DEMO_TAGS } from "@/data/admin-demo";

export default function AdminTagsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tags"
        description="Estrutura de classificação para taxonomia editorial. Persistência real será adicionada no Prompt 09."
      />

      <section className="surface-card p-4 md:p-5">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_DEMO_TAGS.map((tag) => (
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
