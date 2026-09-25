"use client";

import { useMemo, useState } from "react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/Button";
import type { EditorialContentBlock } from "@/lib/editorial/article-blocks";
import type { NewsStatus, UserRole } from "@/lib/domain/editorial";
import { canPublish, getAllowedNextStatuses } from "@/lib/auth/policies";
import { toUrlSlug } from "@/config/site";
import type { EditorialAIErrorCode, EditorialAITask } from "@/lib/ai/types";

type SelectOption = {
  label: string;
  value: string;
};

type AdminNewsEditorFormProps = {
  categories: SelectOption[];
  municipalities: SelectOption[];
  authors: SelectOption[];
  userRole: UserRole;
  aiConfigured: boolean;
  initialDraft?: {
    id: string;
    status: NewsStatus;
    title: string;
    slug: string;
    summary: string;
    categorySlug: string;
    municipalitySlug: string;
    authorId: string;
    heroImageCaption: string;
    heroImageCredit: string;
    tags: string[];
    blocks: EditorialContentBlock[];
    expectedUpdatedAt?: string;
  };
};

type AssistantApplyTarget = "title" | "summary" | "body" | "tags";

type Notice = {
  tone: "info" | "warning" | "error";
  message: string;
};

type ApplySnapshot = {
  title: string;
  summary: string;
  tagInput: string;
  blocks: EditorialContentBlock[];
};

const QUICK_AI_ACTIONS: Array<{
  task: EditorialAITask;
  label: string;
  description: string;
  target: AssistantApplyTarget;
}> = [
  { task: "proofread", label: "Revisar ortografia", description: "Corrige erros de escrita no texto atual.", target: "body" },
  { task: "clarity", label: "Melhorar clareza", description: "Deixa o texto mais direto e fácil de ler.", target: "body" },
  { task: "headline", label: "Sugerir título", description: "Gera opções de título com base no conteúdo.", target: "title" },
  { task: "subheadline", label: "Sugerir subtítulo", description: "Cria um subtítulo complementar.", target: "summary" },
  { task: "summary", label: "Resumir texto", description: "Cria um resumo curto do corpo da notícia.", target: "summary" },
  { task: "tags", label: "Sugerir tags", description: "Sugere tags editoriais para classificação.", target: "tags" },
];

function normalizeBlocks(rawBlocks: unknown): EditorialContentBlock[] {
  if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
    return [fromTextToParagraph("Escreva o primeiro parágrafo da matéria.")];
  }

  const validTypes = new Set(["paragraph", "heading", "list", "quote"]);
  const sanitized = rawBlocks.filter((block) => {
    if (!block || typeof block !== "object") {
      return false;
    }

    const candidate = block as { type?: string };
    return !!candidate.type && validTypes.has(candidate.type);
  }) as EditorialContentBlock[];

  return sanitized.length > 0 ? sanitized : [fromTextToParagraph("Escreva o primeiro parágrafo da matéria.")];
}

function toRelativeTimeLabel(value: string | Date): string {
  const source = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - source.getTime();

  if (!Number.isFinite(diff) || diff < 0) {
    return "agora mesmo";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "agora mesmo";
  }

  if (diff < hour) {
    return `há ${Math.floor(diff / minute)} min`;
  }

  if (diff < day) {
    return `há ${Math.floor(diff / hour)} h`;
  }

  return `há ${Math.floor(diff / day)} dia(s)`;
}

function mapAiErrorMessage(code?: EditorialAIErrorCode): string {
  if (!code) {
    return "Não foi possível gerar a sugestão agora. Tente novamente em alguns instantes.";
  }

  if (code === "RATE_LIMITED") {
    return "Muitas solicitações em sequência. Aguarde um instante e tente de novo.";
  }

  if (code === "UNCONFIGURED" || code === "MODEL_UNAVAILABLE") {
    return "A Assistência Editorial IA está indisponível no momento.";
  }

  return "Não foi possível gerar a sugestão agora. Tente novamente em alguns instantes.";
}

function toPlainTextFromBlocks(blocks: EditorialContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "heading") {
        return block.text;
      }

      if (block.type === "quote") {
        return [block.text, block.citation].filter(Boolean).join(" - ");
      }

      if (block.type === "list") {
        return block.items.map((item) => item.map((node) => node.text).join(" ")).join("\n");
      }

      return block.content.map((node) => node.text).join(" ");
    })
    .join("\n\n")
    .trim();
}

function fromTextToParagraph(text: string): EditorialContentBlock {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

function toTextareaValue(block: EditorialContentBlock): string {
  if (block.type === "heading") {
    return block.text;
  }

  if (block.type === "quote") {
    return block.citation ? `${block.text}\n\nFonte: ${block.citation}` : block.text;
  }

  if (block.type === "list") {
    return block.items.map((item) => item.map((node) => node.text).join(" ")).join("\n");
  }

  return block.content.map((node) => node.text).join(" ");
}

function updateBlockText(block: EditorialContentBlock, value: string): EditorialContentBlock {
  if (block.type === "heading") {
    return {
      ...block,
      text: value,
    };
  }

  if (block.type === "quote") {
    return {
      ...block,
      text: value,
    };
  }

  if (block.type === "list") {
    return {
      ...block,
      items: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => [{ type: "text" as const, text: line }]),
    };
  }

  return {
    ...block,
    content: [{ type: "text", text: value }],
  };
}

export function AdminNewsEditorForm({
  categories,
  municipalities,
  authors,
  userRole,
  aiConfigured,
  initialDraft,
}: AdminNewsEditorFormProps) {
  const isEditing = !!initialDraft;
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [slug, setSlug] = useState(initialDraft?.slug ?? "");
  const [summary, setSummary] = useState(initialDraft?.summary ?? "");
  const [category, setCategory] = useState(initialDraft?.categorySlug || categories[0]?.value || "");
  const [municipality, setMunicipality] = useState(initialDraft?.municipalitySlug || municipalities[0]?.value || "");
  const [author, setAuthor] = useState(initialDraft?.authorId || authors[0]?.value || "");
  const [imageCaption, setImageCaption] = useState(initialDraft?.heroImageCaption ?? "");
  const [imageCredit, setImageCredit] = useState(initialDraft?.heroImageCredit ?? "");
  const [tagInput, setTagInput] = useState(initialDraft?.tags?.join(", ") || "");
  const [status, setStatus] = useState<NewsStatus>(initialDraft?.status ?? "DRAFT");
  const [draftId, setDraftId] = useState<string | null>(initialDraft?.id ?? null);
  const [expectedUpdatedAt, setExpectedUpdatedAt] = useState(initialDraft?.expectedUpdatedAt ?? "");
  const [blocks, setBlocks] = useState<EditorialContentBlock[]>(normalizeBlocks(initialDraft?.blocks));

  const [aiTask, setAiTask] = useState<EditorialAITask>("proofread");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTarget, setAiTarget] = useState<AssistantApplyTarget>("body");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiFeedback, setAiFeedback] = useState<Notice | null>(null);
  const [aiPending, setAiPending] = useState(false);
  const [aiMobileOpen, setAiMobileOpen] = useState(false);
  const [aiPanelVisible, setAiPanelVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workflowPending, setWorkflowPending] = useState(false);
  const [lastAppliedSnapshot, setLastAppliedSnapshot] = useState<ApplySnapshot | null>(null);
  const [actionNotice, setActionNotice] = useState<Notice | null>(null);

  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    JSON.stringify({
      title: initialDraft?.title ?? "",
      slug: initialDraft?.slug ?? "",
      summary: initialDraft?.summary ?? "",
      category: initialDraft?.categorySlug || categories[0]?.value || "",
      municipality: initialDraft?.municipalitySlug || municipalities[0]?.value || "",
      author: initialDraft?.authorId || authors[0]?.value || "",
      imageCaption: initialDraft?.heroImageCaption ?? "",
      imageCredit: initialDraft?.heroImageCredit ?? "",
      tagInput: initialDraft?.tags?.join(", ") || "",
      blocks: normalizeBlocks(initialDraft?.blocks),
    }),
  );

  const bodyText = useMemo(() => toPlainTextFromBlocks(blocks), [blocks]);
  const publishAllowed = canPublish(userRole);
  const allowedNextStatuses = getAllowedNextStatuses(userRole, status);
  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        title,
        slug,
        summary,
        category,
        municipality,
        author,
        imageCaption,
        imageCredit,
        tagInput,
        blocks,
      }),
    [title, slug, summary, category, municipality, author, imageCaption, imageCredit, tagInput, blocks],
  );
  const hasUnsavedChanges = currentSnapshot !== lastSavedSnapshot;

  function handleGenerateSlug() {
    if (!title.trim()) {
      setActionNotice({ tone: "warning", message: "Informe o título antes de gerar o slug." });
      return;
    }

    setSlug(toUrlSlug(title));
    setActionNotice({ tone: "info", message: "Slug sugerido a partir do título atual." });
  }

  function addBlock(type: EditorialContentBlock["type"]) {
    if (type === "heading") {
      setBlocks((current) => [...current, { type: "heading", level: 2, text: "Novo subtítulo" }]);
      return;
    }

    if (type === "list") {
      setBlocks((current) => [
        ...current,
        {
          type: "list",
          style: "unordered",
          items: [[{ type: "text", text: "Novo item" }]],
        },
      ]);
      return;
    }

    if (type === "quote") {
      setBlocks((current) => [...current, { type: "quote", text: "Nova citação", citation: "Fonte" }]);
      return;
    }

    setBlocks((current) => [...current, fromTextToParagraph("Novo parágrafo")]);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= blocks.length) {
      return;
    }

    setBlocks((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  }

  function removeBlock(index: number) {
    setBlocks((current) => current.filter((_, idx) => idx !== index));
  }

  async function requestAiSuggestion() {
    if (!aiConfigured) {
      setAiFeedback({ tone: "warning", message: "IA não configurada no ambiente atual." });
      return;
    }

    const inputByTask: Record<EditorialAITask, string> = {
      headline: title,
      subheadline: summary,
      summary: bodyText,
      proofread: bodyText,
      clarity: bodyText,
      tags: [title, summary, bodyText].filter(Boolean).join("\n"),
      draft: [title, summary, bodyText].filter(Boolean).join("\n"),
    };

    const input = inputByTask[aiTask].trim();

    if (!input) {
      setAiFeedback({ tone: "warning", message: "Adicione conteúdo primeiro para esta ação da Assistência IA." });
      return;
    }

    setAiPending(true);
    setAiFeedback(null);

    const response = await fetch("/api/admin/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: aiTask,
        input,
        context: aiPrompt.trim() || undefined,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; suggestion: string; usageLabel: string }
      | { ok: false; message?: string; code?: EditorialAIErrorCode }
      | null;

    setAiPending(false);

    if (!response.ok || !data?.ok) {
      const errorCode = data && "ok" in data && data.ok === false ? data.code : undefined;
      setAiFeedback({ tone: "error", message: mapAiErrorMessage(errorCode) });
      return;
    }

    setAiSuggestion(data.suggestion);
    const suggestedTarget = QUICK_AI_ACTIONS.find((item) => item.task === aiTask)?.target ?? "body";
    setAiTarget(suggestedTarget);
    setAiFeedback({ tone: "info", message: "Sugestão da IA gerada. Revise antes de aplicar." });
  }

  function applySuggestion() {
    if (!aiSuggestion.trim()) {
      setAiFeedback({ tone: "warning", message: "Nenhuma sugestão disponível para aplicar." });
      return;
    }

    setLastAppliedSnapshot({
      title,
      summary,
      tagInput,
      blocks,
    });

    if (aiTarget === "title") {
      setTitle(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada ao título. Lembre de salvar o rascunho." });
      setAiMobileOpen(false);
      return;
    }

    if (aiTarget === "summary") {
      setSummary(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada ao subtítulo. Lembre de salvar o rascunho." });
      setAiMobileOpen(false);
      return;
    }

    if (aiTarget === "tags") {
      setTagInput(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada em tags. Lembre de salvar o rascunho." });
      setAiMobileOpen(false);
      return;
    }

    setBlocks([fromTextToParagraph(aiSuggestion)]);
    setActionNotice({ tone: "info", message: "Sugestão aplicada ao corpo da matéria. Lembre de salvar o rascunho." });
    setAiMobileOpen(false);
  }

  function discardSuggestion() {
    setAiSuggestion("");
    setAiFeedback({ tone: "info", message: "Sugestão descartada. Seu texto original foi preservado." });
  }

  function copySuggestion() {
    if (!aiSuggestion.trim()) {
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setAiFeedback({ tone: "warning", message: "Não foi possível copiar automaticamente nesta sessão." });
      return;
    }

    void navigator.clipboard.writeText(aiSuggestion);
    setAiFeedback({ tone: "info", message: "Sugestão copiada." });
  }

  function undoLastApply() {
    if (!lastAppliedSnapshot) {
      return;
    }

    setTitle(lastAppliedSnapshot.title);
    setSummary(lastAppliedSnapshot.summary);
    setTagInput(lastAppliedSnapshot.tagInput);
    setBlocks(lastAppliedSnapshot.blocks);
    setLastAppliedSnapshot(null);
    setActionNotice({ tone: "info", message: "Última aplicação da sugestão foi desfeita." });
  }

  function parseTags(tagValue: string): string[] {
    return Array.from(
      new Set(
        tagValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }

  function buildPayload() {
    return {
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      categorySlug: category,
      municipalitySlug: municipality,
      authorId: author || undefined,
      heroImageUrl: "",
      heroImageAlt: "",
      heroImageCaption: imageCaption.trim(),
      heroImageCredit: imageCredit.trim(),
      tags: parseTags(tagInput),
      blocks,
      expectedUpdatedAt: expectedUpdatedAt || undefined,
    };
  }

  async function saveDraft() {
    setSaving(true);

    const endpoint = draftId ? `/api/admin/news/${draftId}` : "/api/admin/news";
    const method = draftId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; data?: { id?: string; status?: NewsStatus } }
      | { ok: false; message?: string }
      | null;

    setSaving(false);

    if (!response.ok || !data?.ok) {
      setActionNotice({
        tone: "error",
        message: data && "message" in data && data.message ? data.message : "Não foi possível salvar o rascunho.",
      });
      return null;
    }

    const persistedId = data.data?.id ?? draftId;

    if (data.data?.id) {
      setDraftId(data.data.id);
    }

    if (data.data?.status) {
      setStatus(data.data.status);
    }

    if (data?.ok && data.data && "updatedAt" in data.data && data.data.updatedAt) {
      setExpectedUpdatedAt(data.data.updatedAt as string);
    }

    setLastSavedSnapshot(currentSnapshot);

    setActionNotice({
      tone: "info",
      message: "Rascunho salvo.",
    });

    return persistedId ?? null;
  }

  async function sendToReview() {
    let newsId = draftId;
    if (!newsId) {
      newsId = await saveDraft();
      if (!newsId) {
        return;
      }
    }

    if (!newsId) {
      setActionNotice({ tone: "error", message: "Falha ao identificar o rascunho para transição." });
      return;
    }

    setWorkflowPending(true);

    const response = await fetch(`/api/admin/news/${newsId}/workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: "IN_REVIEW" }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; data?: { status?: NewsStatus } }
      | { ok: false; message?: string }
      | null;

    setWorkflowPending(false);

    if (!response.ok || !data?.ok) {
      setActionNotice({
        tone: "warning",
        message: "Não foi possível enviar para revisão.",
      });
      return;
    }

    setStatus(data.data?.status ?? "IN_REVIEW");
    if (data?.ok && data.data && "updatedAt" in data.data && data.data.updatedAt) {
      setExpectedUpdatedAt(data.data.updatedAt as string);
    }
    setActionNotice({
      tone: "info",
      message: "Notícia enviada para revisão.",
    });
  }

  async function transitionStatus(to: NewsStatus, successMessage: string) {
    if (!draftId) {
      setActionNotice({ tone: "warning", message: "Salve o rascunho antes de alterar o status." });
      return;
    }

    setWorkflowPending(true);
    const response = await fetch(`/api/admin/news/${draftId}/workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; data?: { status?: NewsStatus } }
      | { ok: false; message?: string }
      | null;

    setWorkflowPending(false);

    if (!response.ok || !data?.ok) {
      setActionNotice({
        tone: "warning",
        message: "Não foi possível atualizar o status desta notícia.",
      });
      return;
    }

    setStatus(data.data?.status ?? to);
    if (data?.ok && data.data && "updatedAt" in data.data && data.data.updatedAt) {
      setExpectedUpdatedAt(data.data.updatedAt as string);
    }

    setActionNotice({
      tone: "info",
      message: successMessage,
    });
  }

  async function publishContent() {
    const confirmed = window.confirm("Publicar esta notícia? Ela ficará disponível no portal.");
    if (!confirmed) {
      return;
    }

    await transitionStatus("PUBLISHED", "Notícia publicada.");
  }

  async function archiveContent() {
    const confirmed = window.confirm("Arquivar esta notícia?");
    if (!confirmed) {
      return;
    }

    await transitionStatus("ARCHIVED", "Notícia arquivada.");
  }

  async function returnToDraft() {
    await transitionStatus("DRAFT", "Notícia movida para rascunho.");
  }

  const assistantPanel = (
    <article className="surface-card space-y-3 p-4 md:p-5" aria-label="Assistência Editorial IA">
      <div className="space-y-1">
        <h2 className="text-h3">Assistência Editorial IA</h2>
        <p className="text-body-sm text-text-muted">Olá! Posso ajudar você a preparar esta notícia.</p>
        <p className="text-body-sm text-text-muted">Escolha uma ação abaixo ou escreva o que precisa.</p>
      </div>

      <p className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-caption text-text-muted">
        A IA pode cometer erros. Revise antes de salvar ou publicar.
      </p>

      {!aiConfigured ? (
        <p className="rounded-md border border-semantic-warning/40 bg-semantic-warning/10 px-3 py-2 text-body-sm text-semantic-warning">
          A Assistência Editorial IA está indisponível agora. Você pode continuar editando normalmente.
        </p>
      ) : null}

      <div className="grid gap-2">
        {QUICK_AI_ACTIONS.map((action) => {
          const isActive = aiTask === action.task;
          const inputByTask: Record<EditorialAITask, string> = {
            headline: title,
            subheadline: summary,
            summary: bodyText,
            proofread: bodyText,
            clarity: bodyText,
            tags: [title, summary, bodyText].filter(Boolean).join("\n"),
            draft: [title, summary, bodyText].filter(Boolean).join("\n"),
          };
          const disabledByContext = !inputByTask[action.task].trim();

          return (
            <button
              key={action.task}
              type="button"
              className={`rounded-md border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-brand-secondary bg-brand-accentLight"
                  : "border-border bg-surface hover:bg-surface-secondary"
              } ${disabledByContext ? "opacity-60" : ""}`}
              onClick={() => {
                setAiTask(action.task);
                setAiTarget(action.target);
                if (disabledByContext) {
                  setAiFeedback({ tone: "warning", message: "Adicione conteúdo para usar esta ação." });
                  return;
                }
                void requestAiSuggestion();
              }}
              disabled={aiPending || !aiConfigured}
            >
              <p className="text-body-sm font-semibold">{action.label}</p>
              <p className="text-caption text-text-muted">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ai-free-request" className="text-body-sm font-semibold">
          Peça ajuda para esta notícia
        </label>
        <textarea
          id="ai-free-request"
          value={aiPrompt}
          onChange={(event) => setAiPrompt(event.target.value)}
          rows={3}
          placeholder="Ex.: Deixe este parágrafo mais claro."
          className="w-full rounded-md border border-border bg-surface px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={requestAiSuggestion} disabled={aiPending || !aiConfigured}>
          {aiPending ? "Preparando sugestão..." : "Gerar sugestão"}
        </Button>
        {aiSuggestion ? (
          <Button variant="outline" onClick={discardSuggestion} disabled={aiPending}>
            Descartar
          </Button>
        ) : null}
      </div>

      {aiFeedback ? (
        <p
          className={`rounded-md px-3 py-2 text-body-sm ${
            aiFeedback.tone === "error"
              ? "border border-semantic-danger/40 bg-semantic-danger/10 text-semantic-danger"
              : aiFeedback.tone === "warning"
                ? "border border-semantic-warning/40 bg-semantic-warning/10 text-semantic-warning"
                : "border border-semantic-info/35 bg-semantic-info/10 text-semantic-info"
          }`}
          role="status"
          aria-live="polite"
        >
          {aiFeedback.message}
        </p>
      ) : null}

      {aiSuggestion ? (
        <div className="space-y-2 rounded-md border border-border bg-surface-secondary p-3">
          <p className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Sugestão</p>
          <p className="whitespace-pre-wrap text-body-sm text-text">{aiSuggestion}</p>

          <div className="space-y-1.5">
            <label htmlFor="ai-target" className="text-body-sm font-semibold">
              Aplicar em
            </label>
            <select
              id="ai-target"
              value={aiTarget}
              onChange={(event) => setAiTarget(event.target.value as AssistantApplyTarget)}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            >
              <option value="title">Título</option>
              <option value="summary">Subtítulo</option>
              <option value="body">Corpo</option>
              <option value="tags">Tags</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={applySuggestion}>
              Aplicar sugestão
            </Button>
            <Button variant="outline" onClick={copySuggestion}>
              Copiar
            </Button>
            <Button variant="ghost" onClick={requestAiSuggestion} disabled={aiPending || !aiConfigured}>
              Gerar outra sugestão
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );

  return (
    <div className="space-y-5">
      <section className="surface-card space-y-3 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-h3">{isEditing ? "Editar notícia" : "Nova notícia"}</h2>
            <p className="text-body-sm text-text-muted">
              {isEditing
                ? "Atualize conteúdo, classificação e workflow com feedback imediato."
                : "Escreva a notícia e salve em rascunho quando estiver pronta."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminStatusBadge status={status} />
            {hasUnsavedChanges ? (
              <span className="rounded-md border border-semantic-warning/40 bg-semantic-warning/10 px-2.5 py-1 text-caption font-semibold text-semantic-warning">
                Alterações não salvas
              </span>
            ) : (
              <span className="rounded-md border border-semantic-success/40 bg-semantic-success/10 px-2.5 py-1 text-caption font-semibold text-semantic-success">
                Tudo salvo
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={saveDraft} disabled={saving || workflowPending}>
            {saving ? "Salvando..." : "Salvar rascunho"}
          </Button>

          {allowedNextStatuses.includes("IN_REVIEW") ? (
            <Button variant="outline" onClick={sendToReview} disabled={saving || workflowPending}>
              {workflowPending ? "Enviando..." : "Enviar para revisão"}
            </Button>
          ) : null}

          {allowedNextStatuses.includes("PUBLISHED") && publishAllowed ? (
            <Button variant="secondary" onClick={publishContent} disabled={saving || workflowPending}>
              {workflowPending ? "Publicando..." : "Publicar notícia"}
            </Button>
          ) : null}

          {allowedNextStatuses.includes("ARCHIVED") ? (
            <Button variant="ghost" onClick={archiveContent} disabled={saving || workflowPending}>
              Arquivar
            </Button>
          ) : null}

          {allowedNextStatuses.includes("DRAFT") && status !== "DRAFT" ? (
            <Button variant="outline" onClick={returnToDraft} disabled={saving || workflowPending}>
              Voltar para rascunho
            </Button>
          ) : null}

          <Button
            variant="outline"
            className="xl:hidden"
            onClick={() => setAiMobileOpen(true)}
            aria-controls="assistencia-ia-mobile"
          >
            Assistência IA
          </Button>

          {lastAppliedSnapshot ? (
            <Button variant="ghost" onClick={undoLastApply}>
              Desfazer última aplicação
            </Button>
          ) : null}
        </div>

        <p className="text-caption text-text-muted">Última atualização: {toRelativeTimeLabel(expectedUpdatedAt || new Date())}</p>

        {actionNotice ? (
          <p
            className={`rounded-md px-3 py-2 text-body-sm ${
              actionNotice.tone === "error"
                ? "border border-semantic-danger/40 bg-semantic-danger/10 text-semantic-danger"
                : actionNotice.tone === "warning"
                  ? "border border-semantic-warning/40 bg-semantic-warning/10 text-semantic-warning"
                  : "border border-semantic-info/35 bg-semantic-info/10 text-semantic-info"
            }`}
            role="status"
            aria-live="polite"
          >
            {actionNotice.message}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,34%)]">
        <section className="space-y-5">
        <article className="surface-card space-y-4 p-4 md:p-5">
          <h2 className="text-h3">Conteúdo</h2>

          <p className="text-body-sm text-text-muted">Escreva um título claro e objetivo.</p>

          <div className="space-y-1.5">
            <label htmlFor="news-title" className="text-body-sm font-semibold">
              Título
            </label>
            <input
              id="news-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-12 w-full rounded-md border border-border bg-surface px-3 text-body-lg"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-1.5">
              <label htmlFor="news-slug" className="text-body-sm font-semibold">
                Slug
              </label>
              <input
                id="news-slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              />
            </div>
            <Button variant="outline" className="h-11 px-4" onClick={handleGenerateSlug}>
              Sugerir slug
            </Button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-summary" className="text-body-sm font-semibold">
                Subtítulo
            </label>
            <textarea
              id="news-summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-surface px-3 py-2"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="news-category" className="text-body-sm font-semibold">
                Categoria
              </label>
              <select
                id="news-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="news-municipality" className="text-body-sm font-semibold">
                Município
              </label>
              <select
                id="news-municipality"
                value={municipality}
                onChange={(event) => setMunicipality(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              >
                {municipalities.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="news-author" className="text-body-sm font-semibold">
                Autor
              </label>
              <select
                id="news-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              >
                {authors.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="news-caption" className="text-body-sm font-semibold">
                Legenda da imagem
              </label>
              <input
                id="news-caption"
                value={imageCaption}
                onChange={(event) => setImageCaption(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="news-credit" className="text-body-sm font-semibold">
                Crédito da imagem
              </label>
              <input
                id="news-credit"
                value={imageCredit}
                onChange={(event) => setImageCredit(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-tags" className="text-body-sm font-semibold">
              Tags (separadas por vírgula)
            </label>
            <input
              id="news-tags"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            />
          </div>

          <p className="text-caption text-text-muted">Status atual: <strong>{status}</strong></p>
        </article>

        <article className="surface-card space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-h3">Corpo da notícia</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-11 px-4" onClick={() => addBlock("paragraph")}>Adicionar parágrafo</Button>
              <Button variant="outline" size="sm" className="h-11 px-4" onClick={() => addBlock("heading")}>Adicionar subtítulo</Button>
              <Button variant="outline" size="sm" className="h-11 px-4" onClick={() => addBlock("list")}>Adicionar lista</Button>
              <Button variant="outline" size="sm" className="h-11 px-4" onClick={() => addBlock("quote")}>Adicionar citação</Button>
            </div>
          </div>

          <ul className="space-y-3">
            {blocks.map((block, index) => (
              <li key={`${block.type}-${index}`} className="rounded-md border border-border bg-surface-secondary p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Bloco {index + 1} • {block.type}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" className="h-10 px-3" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                      Subir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 px-3"
                      onClick={() => moveBlock(index, 1)}
                      disabled={index === blocks.length - 1}
                    >
                      Descer
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 px-3" onClick={() => removeBlock(index)}>
                      Remover
                    </Button>
                  </div>
                </div>

                <textarea
                  value={toTextareaValue(block)}
                  onChange={(event) =>
                    setBlocks((current) =>
                      current.map((entry, idx) => (idx === index ? updateBlockText(entry, event.target.value) : entry)),
                    )
                  }
                  rows={block.type === "list" ? 5 : 4}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 md:text-body"
                />
              </li>
            ))}
          </ul>
        </article>
        </section>

        <aside className="hidden space-y-3 xl:block">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setAiPanelVisible((value) => !value)}>
              {aiPanelVisible ? "Ocultar assistência" : "Mostrar assistência IA"}
            </Button>
          </div>
          {aiPanelVisible ? assistantPanel : null}
        </aside>
      </div>

      {aiMobileOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden" role="dialog" aria-modal="true" aria-label="Assistência Editorial IA mobile">
          <button
            type="button"
            className="absolute inset-0 bg-overlay/50"
            onClick={() => setAiMobileOpen(false)}
            aria-label="Fechar assistência"
          />
          <div
            id="assistencia-ia-mobile"
            className="absolute inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-xl border border-border bg-canvas p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-body font-semibold">Assistência Editorial IA</h3>
              <Button variant="ghost" size="sm" onClick={() => setAiMobileOpen(false)}>
                Fechar
              </Button>
            </div>
            {assistantPanel}
          </div>
        </div>
      ) : null}
    </div>
  );
}
