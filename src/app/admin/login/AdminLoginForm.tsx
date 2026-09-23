"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type AdminLoginFormProps = {
  defaultEmail?: string;
};

export function AdminLoginForm({ defaultEmail = "" }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (!result?.ok) {
      setError("Não foi possível autenticar com os dados informados.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="text-body-sm font-semibold">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-body-sm font-semibold">
          Senha
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-semantic-danger/40 bg-semantic-danger/10 px-3 py-2 text-body-sm text-semantic-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}
