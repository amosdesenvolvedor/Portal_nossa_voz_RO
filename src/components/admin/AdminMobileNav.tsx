"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import type { AdminNavItem } from "@/lib/admin/navigation";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

type AdminMobileNavProps = {
  items: AdminNavItem[];
};

export function AdminMobileNav({ items }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-controls="admin-mobile-nav"
        aria-label={open ? "Fechar menu administrativo" : "Abrir menu administrativo"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-40 bg-overlay/50" onClick={() => setOpen(false)} aria-hidden />
      ) : null}

      <aside
        id="admin-mobile-nav"
        className={`fixed inset-y-0 right-0 z-50 w-[min(22rem,100vw)] overflow-y-auto border-l border-border bg-surface p-4 shadow-elevated transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-caption uppercase tracking-[0.08em] text-text-muted">Nossa Voz RO</p>
            <p className="text-body font-semibold">Área Editorial</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setOpen(false)}>
            <CloseIcon />
          </Button>
        </div>

        <p className="mb-3 rounded-md border border-border bg-surface-secondary px-3 py-2 text-body-sm text-text-muted">
          Acesso rápido: <strong className="text-text">+ Nova notícia</strong>
        </p>

        <AdminSidebarNav items={items} onNavigate={() => setOpen(false)} />
      </aside>
    </div>
  );
}
