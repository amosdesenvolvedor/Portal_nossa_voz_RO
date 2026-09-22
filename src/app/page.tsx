import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="flex flex-1 items-center bg-canvas py-16 md:py-24">
      <Container className="w-full">
        <section className="surface-card space-y-6 p-7 md:p-10">
          <BrandLogo priority className="max-w-[200px] md:max-w-[260px]" href="/" />
          <h1 className="text-display max-w-reading text-brand-primary">A VOZ DE QUEM VIVE AQUI</h1>
          <p className="max-w-reading text-body-lg text-text-muted">
            Fundacao tecnica concluida e Design System em construcao incremental.
            Esta pagina e provisoria e sera substituida pela Home editorial no Prompt 04.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/design-system"
              className="inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-4 text-body font-semibold text-text-inverse no-underline transition-colors duration-fast ease-standard hover:bg-brand-secondary"
            >
              Ir para validacao visual
            </Link>
            <Link href="/design-system" className="text-body-sm font-semibold">
              Ver componentes base
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
