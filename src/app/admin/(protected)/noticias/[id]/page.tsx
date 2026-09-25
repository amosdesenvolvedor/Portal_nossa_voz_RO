import { notFound } from "next/navigation";
import { AdminNewsEditorForm } from "@/components/admin/AdminNewsEditorForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getEditorialAIStatus } from "@/lib/ai/editorial";
import { getAiImageProviderStatus } from "@/lib/ai/images/provider";
import { requireAuthSession } from "@/lib/auth/session";
import { getAdminNewsById, listAdminReferenceData } from "@/lib/services/editorial-service";

type AdminNewsDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminNewsDetailsPage({ params }: AdminNewsDetailsPageProps) {
  const session = await requireAuthSession();
  const actor = { id: session.user.id, role: session.user.role };

  const resolvedParams = await params;
  const entry = await getAdminNewsById(resolvedParams.id, actor);

  if (!entry) {
    notFound();
  }

  const [referenceData, aiStatus, aiImageStatus] = await Promise.all([
    listAdminReferenceData(),
    getEditorialAIStatus(),
    getAiImageProviderStatus(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar notícia"
        description="Atualize conteúdo e workflow mantendo o editor como protagonista."
      />

      <AdminNewsEditorForm
        categories={referenceData.categories.map((item) => ({ label: item.name, value: item.slug }))}
        municipalities={referenceData.municipalities.map((item) => ({ label: item.name, value: item.slug }))}
        authors={referenceData.authors.map((item) => ({ label: item.name, value: item.id }))}
        userRole={session.user.role}
        aiConfigured={aiStatus.configured}
        aiImageAvailable={aiImageStatus.available}
        initialDraft={{
          id: entry.id,
          status: entry.status,
          title: entry.title,
          slug: entry.slug,
          summary: entry.summary ?? "",
          categorySlug: entry.category?.slug ?? "",
          municipalitySlug: entry.municipality?.slug ?? "",
          authorId: entry.author?.id ?? entry.createdBy.id,
          heroImageCaption: entry.heroImageCaption ?? "",
          heroImageCredit: entry.heroImageCredit ?? "",
          tags: entry.tags.map((tag) => tag.name),
          blocks: Array.isArray(entry.contentBlocks) ? (entry.contentBlocks as never) : [],
          expectedUpdatedAt: entry.updatedAt.toISOString(),
          heroMediaAssetId: entry.heroMediaAssetId,
          mediaAssets: entry.mediaLinks.map((link) => ({
            id: link.mediaAsset.id,
            origin: link.mediaAsset.origin,
            mimeType: link.mediaAsset.mimeType,
            width: link.mediaAsset.width,
            height: link.mediaAsset.height,
            fileSize: link.mediaAsset.fileSize,
            altText: link.mediaAsset.altText,
            caption: link.mediaAsset.caption,
            credit: link.mediaAsset.credit,
            isSensitive: link.mediaAsset.isSensitive,
            isBlurred: link.mediaAsset.isBlurred,
            publicUrl: `/media/${link.mediaAsset.id}`,
            sortOrder: link.sortOrder,
          })),
        }}
      />
    </div>
  );
}
