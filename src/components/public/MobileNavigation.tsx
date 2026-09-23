"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CATEGORY_NAVIGATION,
  FEATURED_MUNICIPALITY_NAVIGATION,
  INSTITUTIONAL_NAVIGATION,
  MAIN_NAVIGATION,
} from "@/config/site";
import { Button } from "@/components/ui/Button";

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

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className="relative lg:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isOpen ? "Fechar menu principal" : "Abrir menu principal"}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </Button>

      {isOpen ? (
        <div
          id="mobile-navigation-panel"
          className="absolute right-0 z-30 mt-3 w-[min(22rem,calc(100vw-2rem))] surface-card p-4 shadow-card"
        >
          <div className="space-y-5">
            <section>
              <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">Principal</h2>
              <ul className="mt-2 grid gap-2">
                {MAIN_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-sm px-2 py-2 text-body-sm font-semibold" onClick={handleClose}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">Categorias</h2>
              <ul className="mt-2 grid gap-2">
                {CATEGORY_NAVIGATION.slice(0, 6).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-sm px-2 py-2 text-body-sm" onClick={handleClose}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">Municipios</h2>
              <ul className="mt-2 grid gap-2">
                {FEATURED_MUNICIPALITY_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-sm px-2 py-2 text-body-sm" onClick={handleClose}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">Institucional</h2>
              <ul className="mt-2 grid gap-2">
                {INSTITUTIONAL_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-sm px-2 py-2 text-body-sm" onClick={handleClose}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
