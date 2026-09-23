import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AD_POSITIONS } from "@/lib/domain/editorial";

export default function AdminAdvertisingPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Publicidade"
        description="Estrutura inicial para governança de slots editoriais. Integrações com redes de anúncios não fazem parte desta etapa."
      />

      <section className="surface-card p-4 md:p-5">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AD_POSITIONS.map((slot) => (
            <li key={slot} className="rounded-md border border-border bg-surface-secondary px-3 py-2">
              <p className="font-semibold">{slot}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
