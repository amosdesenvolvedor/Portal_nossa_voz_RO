import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listAuthors } from "@/lib/services/editorial-service";

export default async function AdminAuthorsPage() {
  const authors = await listAuthors();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Autores"
        description="Listagem administrativa de autoria editorial vinculada a usuários persistidos."
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
            {authors.map((author) => (
              <tr key={author.id}>
                <td className="px-4 py-3 font-semibold">{author.name}</td>
                <td className="px-4 py-3">{author.role}</td>
                <td className="px-4 py-3">{author.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
