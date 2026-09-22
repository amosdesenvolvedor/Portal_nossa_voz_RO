import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="bg-canvas py-14">
      <Container>
        <section className="surface-card space-y-4 p-7 md:p-10">
          <p className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Erro 404</p>
          <h1 className="text-h1">Conteudo nao encontrado</h1>
          <p className="max-w-reading text-body-lg text-text-muted">
            A pagina solicitada nao existe, foi movida ou ainda nao esta disponivel.
          </p>
          <Link href="/" className="inline-flex text-body-sm font-semibold">
            Voltar para a pagina inicial
          </Link>
        </section>
      </Container>
    </main>
  );
}
