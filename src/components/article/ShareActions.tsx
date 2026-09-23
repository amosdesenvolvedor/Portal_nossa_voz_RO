"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type ShareActionsProps = {
  title: string;
  className?: string;
};

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
      <path d="M6 14a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" />
      <path d="M18 21a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
      <path d="m8.59 15.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </svg>
  );
}

const linkClassName =
  "inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-4 text-body-sm font-semibold no-underline text-text transition-colors duration-fast ease-standard hover:bg-surface-secondary";

export function ShareActions({ title, className }: ShareActionsProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setNativeShareAvailable(typeof navigator.share === "function");
  }, []);

  async function handleCopyLink() {
    if (!currentUrl) {
      setFeedback("Link indisponível no momento.");
      return;
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      setFeedback("Link copiado com sucesso.");
    } catch {
      setFeedback("Não foi possível copiar o link.");
    }
  }

  async function handleNativeShare() {
    if (!nativeShareAvailable || !currentUrl) {
      setFeedback("Compartilhamento nativo indisponível.");
      return;
    }

    try {
      await navigator.share({
        title,
        url: currentUrl,
      });
      setFeedback("Compartilhamento iniciado.");
    } catch {
      setFeedback("Compartilhamento cancelado ou indisponível.");
    }
  }

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);
  const whatsappHref = currentUrl ? `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` : "";
  const facebookHref = currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : "";
  const xHref = currentUrl ? `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` : "";

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-11 px-4"
          startIcon={<ShareIcon />}
          onClick={handleCopyLink}
          disabled={!currentUrl}
        >
          Copiar link
        </Button>

        {nativeShareAvailable ? (
          <Button variant="ghost" size="sm" className="h-11 px-4" onClick={handleNativeShare} disabled={!currentUrl}>
            Compartilhar no dispositivo
          </Button>
        ) : null}

        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noreferrer" className={linkClassName}>
            WhatsApp
          </a>
        ) : null}

        {facebookHref ? (
          <a href={facebookHref} target="_blank" rel="noreferrer" className={linkClassName}>
            Facebook
          </a>
        ) : null}

        {xHref ? (
          <a href={xHref} target="_blank" rel="noreferrer" className={linkClassName}>
            X
          </a>
        ) : null}
      </div>

      <p className="text-caption text-text-muted" role="status" aria-live="polite">
        {feedback || "Use uma das ações para compartilhar esta matéria."}
      </p>
    </div>
  );
}