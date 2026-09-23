import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ADMIN_DEMO_AUTHORS } from "@/data/admin-demo";

export default function AdminAuthorsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Autores"
        description="Listagem administrativa de autoria editorial. Mapeamento definitivo com usuários autenticados será consolidado no Prompt 09."
      />

      <section className="surface-card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left text-body-sm">
          <thead className="bg-surface-secondary text-caption uppercase tracking-[0.08em] text-text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Papel editorial</th>
              <th className="px-4 py-3">Contato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADMIN_DEMO_AUTHORS.map((author) => (
              <tr key={author.id}>
                <td className="px-4 py-3 font-semibold">{author.name}</td>
                <td className="px-4 py-3">{author.roleLabel}</td>
                <td className="px-4 py-3">{author.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
