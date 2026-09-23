import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ADMIN_DEMO_MUNICIPALITIES } from "@/data/admin-demo";

export default function AdminMunicipalitiesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Municípios"
        description="Estrutura administrativa geográfica para cobertura regional escalável em Rondônia."
      />

      <section className="surface-card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left text-body-sm">
          <thead className="bg-surface-secondary text-caption uppercase tracking-[0.08em] text-text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Região</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3">Destaque</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADMIN_DEMO_MUNICIPALITIES.map((municipality) => (
              <tr key={municipality.id}>
                <td className="px-4 py-3 font-semibold">{municipality.name}</td>
                <td className="px-4 py-3">/{municipality.slug}</td>
                <td className="px-4 py-3">{municipality.region}</td>
                <td className="px-4 py-3">{municipality.isActive ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">{municipality.featured ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
