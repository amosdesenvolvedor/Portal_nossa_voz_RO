import { AdminNewsEditorForm } from "@/components/admin/AdminNewsEditorForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getEditorialAIStatus } from "@/lib/ai/editorial";
import { getAiImageProviderStatus } from "@/lib/ai/images/provider";
import { requireAuthSession } from "@/lib/auth/session";
import { listAdminReferenceData } from "@/lib/services/editorial-service";

export default async function AdminCreateNewsPage() {
  const session = await requireAuthSession();
  const referenceData = await listAdminReferenceData();
  const aiStatus = getEditorialAIStatus();
  const aiImageStatus = getAiImageProviderStatus();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nova notícia"
        description="Escreva com foco no conteúdo e use a Assistência Editorial IA como copiloto quando precisar."
      />

      <AdminNewsEditorForm
        categories={referenceData.categories.map((item) => ({ label: item.name, value: item.slug }))}
        municipalities={referenceData.municipalities.map((item) => ({ label: item.name, value: item.slug }))}
        authors={referenceData.authors.map((item) => ({ label: item.name, value: item.id }))}
        userRole={session.user.role}
        aiConfigured={aiStatus.configured}
        aiImageAvailable={aiImageStatus.available}
      />
    </div>
  );
}
