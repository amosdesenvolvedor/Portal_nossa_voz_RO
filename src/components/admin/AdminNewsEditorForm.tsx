"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EditorialContentBlock } from "@/lib/editorial/article-blocks";
import { NEWS_STATUS, type NewsStatus, type UserRole } from "@/lib/domain/editorial";
import { canPublish, getAllowedNextStatuses } from "@/lib/auth/policies";
import { toUrlSlug } from "@/config/site";
import { EDITORIAL_AI_TASKS, type EditorialAITask } from "@/lib/ai/types";

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
};

type AssistantApplyTarget = "title" | "summary" | "body" | "tags";

type Notice = {
  tone: "info" | "warning" | "error";
  message: string;
};

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
}: AdminNewsEditorFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(categories[0]?.value ?? "");
  const [municipality, setMunicipality] = useState(municipalities[0]?.value ?? "");
  const [region, setRegion] = useState("Zona da Mata");
  const [author, setAuthor] = useState(authors[0]?.value ?? "");
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [tagInput, setTagInput] = useState("jornalismo regional, nossa voz ro");
  const [status, setStatus] = useState<NewsStatus>("DRAFT");
  const [blocks, setBlocks] = useState<EditorialContentBlock[]>([
    fromTextToParagraph("Escreva o primeiro parágrafo da matéria."),
  ]);

  const [aiTask, setAiTask] = useState<EditorialAITask>("proofread");
  const [aiContext, setAiContext] = useState("");
  const [aiTarget, setAiTarget] = useState<AssistantApplyTarget>("summary");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiFeedback, setAiFeedback] = useState<Notice | null>(null);
  const [aiPending, setAiPending] = useState(false);
  const [actionNotice, setActionNotice] = useState<Notice | null>(null);

  const bodyText = useMemo(() => toPlainTextFromBlocks(blocks), [blocks]);
  const publishAllowed = canPublish(userRole);
  const allowedNextStatuses = getAllowedNextStatuses(userRole, status);

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
      setAiFeedback({ tone: "warning", message: "Não há conteúdo suficiente para gerar sugestão da IA." });
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
        context: aiContext.trim() || undefined,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; suggestion: string; usageLabel: string }
      | { ok: false; message?: string; code?: string }
      | null;

    setAiPending(false);

    if (!response.ok || !data?.ok) {
      const fallbackMessage = "Não foi possível gerar a sugestão agora. Seu conteúdo foi preservado.";
      const responseMessage = data && "message" in data ? data.message : undefined;

      setAiFeedback({
        tone: "error",
        message: responseMessage || fallbackMessage,
      });
      return;
    }

    setAiSuggestion(data.suggestion);
    setAiFeedback({ tone: "info", message: "Sugestão da IA gerada. Revise antes de aplicar." });
  }

  function applySuggestion() {
    if (!aiSuggestion.trim()) {
      setAiFeedback({ tone: "warning", message: "Nenhuma sugestão disponível para aplicar." });
      return;
    }

    if (aiTarget === "title") {
      setTitle(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada ao título." });
      return;
    }

    if (aiTarget === "summary") {
      setSummary(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada ao resumo." });
      return;
    }

    if (aiTarget === "tags") {
      setTagInput(aiSuggestion);
      setActionNotice({ tone: "info", message: "Sugestão aplicada ao campo de tags." });
      return;
    }

    setBlocks([fromTextToParagraph(aiSuggestion)]);
    setActionNotice({ tone: "info", message: "Sugestão aplicada ao corpo da matéria." });
  }

  function saveDraft() {
    setActionNotice({ tone: "info", message: "Salvar rascunho preparado. Persistência real será conectada no Prompt 09." });
  }

  async function sendToReview() {
    const response = await fetch("/api/admin/workflow/preview-transition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: status, to: "IN_REVIEW" }),
    });

    const data = (await response.json().catch(() => null)) as { ok: boolean; message?: string } | null;

    if (!response.ok || !data?.ok) {
      setActionNotice({
        tone: "warning",
        message: data?.message || "Seu papel não pode enviar este status para revisão.",
      });
      return;
    }

    setStatus("IN_REVIEW");
    setActionNotice({
      tone: "info",
      message: "Transição autorizada no servidor. Persistência real será conectada no Prompt 09.",
    });
  }

  async function publishContent() {
    const response = await fetch("/api/admin/workflow/preview-transition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: status, to: "PUBLISHED" }),
    });

    const data = (await response.json().catch(() => null)) as { ok: boolean; message?: string } | null;

    if (!response.ok || !data?.ok) {
      setActionNotice({
        tone: "warning",
        message: data?.message || "Seu papel não possui autorização de publicação.",
      });
      return;
    }

    setActionNotice({
      tone: "warning",
      message: "Publicação autorizada em policy server-side, mas não persistida nesta etapa. Prompt 09 fará gravação real.",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-5">
        <article className="surface-card space-y-4 p-4 md:p-5">
          <h2 className="text-h3">Dados principais</h2>

          <div className="space-y-1.5">
            <label htmlFor="news-title" className="text-body-sm font-semibold">
              Título
            </label>
            <input
              id="news-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
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
              Subtítulo / resumo
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
              <label htmlFor="news-region" className="text-body-sm font-semibold">
                Região
              </label>
              <input
                id="news-region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              />
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

          <div className="space-y-1.5">
            <label htmlFor="news-status" className="text-body-sm font-semibold">
              Status editorial
            </label>
            <select
              id="news-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as NewsStatus)}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            >
              {NEWS_STATUS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <p className="text-caption text-text-muted">Próximos status permitidos para {userRole}: {allowedNextStatuses.join(", ") || "nenhum"}.</p>
          </div>
        </article>

        <article className="surface-card space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-h3">Corpo estruturado</h2>
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
                  className="w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card space-y-3 p-4 md:p-5">
          <h2 className="text-h3">Ações editoriais</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveDraft}>Salvar rascunho</Button>
            <Button variant="outline" onClick={sendToReview}>
              Enviar para revisão
            </Button>
            <Button variant="secondary" onClick={publishContent} disabled={!publishAllowed}>
              Publicar
            </Button>
            <Button variant="ghost" disabled>
              Visualizar prévia (em preparação)
            </Button>
          </div>

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
        </article>
      </section>

      <aside className="space-y-4">
        <article className="surface-card space-y-3 p-4 md:p-5">
          <h2 className="text-h3">Assistência por IA</h2>
          <p className="text-body-sm text-text-muted">
            Toda resposta aparece como sugestão. O conteúdo só muda quando você clicar em aplicar.
          </p>

          {!aiConfigured ? (
            <p className="rounded-md border border-semantic-warning/40 bg-semantic-warning/10 px-3 py-2 text-body-sm text-semantic-warning">
              IA não configurada no ambiente. Configure OPENROUTER_API_KEY para habilitar esta área.
            </p>
          ) : null}

          <div className="space-y-1.5">
            <label htmlFor="ai-task" className="text-body-sm font-semibold">
              Ação da IA
            </label>
            <select
              id="ai-task"
              value={aiTask}
              onChange={(event) => setAiTask(event.target.value as EditorialAITask)}
              className="h-11 w-full rounded-md border border-border bg-surface px-3"
            >
              {EDITORIAL_AI_TASKS.map((task) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ai-context" className="text-body-sm font-semibold">
              Contexto adicional (opcional)
            </label>
            <textarea
              id="ai-context"
              value={aiContext}
              onChange={(event) => setAiContext(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-surface px-3 py-2"
            />
          </div>

          <Button onClick={requestAiSuggestion} disabled={aiPending || !aiConfigured}>
            {aiPending ? "Gerando sugestão..." : "Gerar sugestão"}
          </Button>

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
              <p className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Sugestão da IA</p>
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
                  <option value="summary">Resumo</option>
                  <option value="body">Corpo</option>
                  <option value="tags">Tags</option>
                </select>
              </div>

              <Button variant="secondary" onClick={applySuggestion}>
                Aplicar sugestão
              </Button>
            </div>
          ) : null}
        </article>
      </aside>
    </div>
  );
}
