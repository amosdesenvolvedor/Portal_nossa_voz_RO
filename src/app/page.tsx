import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="flex flex-1 items-center bg-canvas py-16 md:py-24">
      <Container className="w-full">
        <section className="surface-card space-y-6 p-7 md:p-10">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-secondary">Nossa Voz RO</p>
          <h1 className="text-display max-w-reading text-brand-primary">A VOZ DE QUEM VIVE AQUI</h1>
          <p className="max-w-reading text-body-lg text-text-muted">
            Fundacao tecnica concluida e Design System em construcao incremental.
            Esta pagina e provisoria e sera substituida pela Home editorial no Prompt 04.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/design-system" className="no-underline">
              <Button>Ir para validacao visual</Button>
            </Link>
            <Link href="/design-system" className="text-body-sm font-semibold text-brand-secondary">
              Ver componentes base
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
