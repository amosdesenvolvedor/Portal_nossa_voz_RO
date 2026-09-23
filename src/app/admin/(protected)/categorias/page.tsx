import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ADMIN_DEMO_CATEGORIES } from "@/data/admin-demo";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categorias"
        description="Área estrutural para governança de categorias editoriais. CRUD persistente será conectado no Prompt 09."
      />

      <section className="surface-card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left text-body-sm">
          <thead className="bg-surface-secondary text-caption uppercase tracking-[0.08em] text-text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADMIN_DEMO_CATEGORIES.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3 font-semibold">{category.name}</td>
                <td className="px-4 py-3">/{category.slug}</td>
                <td className="px-4 py-3">{category.isActive ? "Ativa" : "Inativa"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
