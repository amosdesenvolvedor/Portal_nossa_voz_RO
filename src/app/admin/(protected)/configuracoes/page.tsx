import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getEditorialAIStatus } from "@/lib/ai/editorial";

export default function AdminSettingsPage() {
  const aiStatus = getEditorialAIStatus();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configurações"
        description="Área estrutural para organização futura de Portal, Editorial, IA, SEO e Publicidade."
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article className="surface-card space-y-2 p-4">
          <h2 className="text-h4">Portal</h2>
          <p className="text-body-sm text-text-muted">Configurações gerais em preparação.</p>
        </article>

        <article className="surface-card space-y-2 p-4">
          <h2 className="text-h4">Editorial</h2>
          <p className="text-body-sm text-text-muted">Políticas e workflow com persistência no Prompt 09.</p>
        </article>

        <article className="surface-card space-y-2 p-4">
          <h2 className="text-h4">IA</h2>
          <p className="text-body-sm text-text-muted">Status: {aiStatus.configured ? "IA configurada" : "IA não configurada"}.</p>
          <p className="text-caption text-text-muted">Modelo configurado: {aiStatus.model}</p>
        </article>

        <article className="surface-card space-y-2 p-4">
          <h2 className="text-h4">SEO</h2>
          <p className="text-body-sm text-text-muted">Painel SEO avançado previsto para etapa futura.</p>
        </article>

        <article className="surface-card space-y-2 p-4">
          <h2 className="text-h4">Publicidade</h2>
          <p className="text-body-sm text-text-muted">Controle operacional de campanhas em preparação.</p>
        </article>
      </section>
    </div>
  );
}
