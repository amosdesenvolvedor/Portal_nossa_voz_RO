import { AdminNewsEditorForm } from "@/components/admin/AdminNewsEditorForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ADMIN_DEMO_AUTHORS, ADMIN_DEMO_CATEGORIES, ADMIN_DEMO_MUNICIPALITIES } from "@/data/admin-demo";
import { getEditorialAIStatus } from "@/lib/ai/editorial";
import { requireAuthSession } from "@/lib/auth/session";

export default async function AdminCreateNewsPage() {
  const session = await requireAuthSession();
  const aiStatus = getEditorialAIStatus();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nova notícia"
        description="Editor inicial por blocos tipados com ações editoriais e assistência por IA controlada."
      />

      <AdminNewsEditorForm
        categories={ADMIN_DEMO_CATEGORIES.map((item) => ({ label: item.name, value: item.slug }))}
        municipalities={ADMIN_DEMO_MUNICIPALITIES.map((item) => ({ label: item.name, value: item.slug }))}
        authors={ADMIN_DEMO_AUTHORS.map((item) => ({ label: item.name, value: item.id }))}
        userRole={session.user.role}
        aiConfigured={aiStatus.configured}
      />
    </div>
  );
}
