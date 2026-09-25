import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { Divider } from "@/components/ui/Divider";
import { ADMIN_NAVIGATION } from "@/lib/admin/navigation";

type AdminShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role: "ADMIN" | "EDITOR" | "AUTHOR";
  };
  children: ReactNode;
};

const ROLE_LABELS: Record<AdminShellProps["user"]["role"], string> = {
  ADMIN: "Administrador",
  EDITOR: "Editor",
  AUTHOR: "Autor",
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-surface p-4 lg:block">
          <BrandLogo href="/admin" />
          <p className="mt-4 text-caption text-text-muted">Navegação editorial</p>
          <Divider className="my-4" />
          <AdminSidebarNav items={ADMIN_NAVIGATION} />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="border-b border-border bg-surface">
            <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
              <div className="min-w-0">
                <p className="text-caption uppercase tracking-[0.08em] text-text-muted">Nossa Voz RO</p>
                <h1 className="truncate text-body font-semibold">Área Editorial</h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden text-right md:block">
                  <p className="truncate text-body-sm font-semibold">{user.name || user.email}</p>
                  <p className="text-caption text-text-muted">{ROLE_LABELS[user.role]}</p>
                </div>
                <AdminSignOutButton />
                <AdminMobileNav items={ADMIN_NAVIGATION} />
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8" id="admin-main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
