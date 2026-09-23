import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";
import { getAuthSession } from "@/lib/auth/session";
import { NO_INDEX_NO_FOLLOW } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: NO_INDEX_NO_FOLLOW,
  alternates: {
    canonical: absoluteUrl("/admin/login"),
  },
};

export default async function AdminLoginPage() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-12">
      <section className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="space-y-4">
          <BrandLogo href="/" className="max-w-[180px]" />
          <div>
            <h1 className="text-h2">Acesso ao painel</h1>
            <p className="mt-1 text-body-sm text-text-muted">
              Faça login para acessar o fluxo editorial interno do Nossa Voz RO.
            </p>
          </div>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
