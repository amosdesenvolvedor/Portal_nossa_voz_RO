"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";

type AppChromeProps = {
  children: ReactNode;
};

function SkipLink({ target }: { target: string }) {
  return (
    <a
      href={target}
      className="sr-only absolute left-3 top-3 z-50 rounded-sm bg-brand-accent px-3 py-2 text-body-sm font-semibold text-text focus:not-sr-only"
    >
      Pular para o conteudo
    </a>
  );
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return (
      <>
        <SkipLink target="#admin-main-content" />
        {children}
      </>
    );
  }

  return (
    <>
      <SkipLink target="#main-content" />
      <PublicHeader />
      <div id="main-content" className="min-w-0 flex-1 overflow-x-clip">
        {children}
      </div>
      <PublicFooter />
    </>
  );
}