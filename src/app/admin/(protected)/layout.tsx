import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAuthSession } from "@/lib/auth/session";

type AdminProtectedLayoutProps = {
  children: ReactNode;
};

export default async function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
  const session = await requireAuthSession();

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
