import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import {
  CATEGORY_NAVIGATION,
  FEATURED_MUNICIPALITY_NAVIGATION,
  INSTITUTIONAL_NAVIGATION,
  SITE_CONFIG,
} from "@/config/site";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section className="space-y-3">
            <BrandLogo href="/" />
            <p className="text-body-sm text-text-muted">{SITE_CONFIG.slogan}</p>
            <p className="text-caption text-text-muted">Espaco para redes sociais oficiais (integracao futura).</p>
          </section>

          <section>
            <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Institucional</h2>
            <ul className="mt-3 space-y-2">
              {INSTITUTIONAL_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Categorias</h2>
            <ul className="mt-3 space-y-2">
              {CATEGORY_NAVIGATION.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-secondary">Regional</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/municipios" className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                  Municipios
                </Link>
              </li>
              {FEATURED_MUNICIPALITY_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/publicidade" className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                  Publicidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-body-sm no-underline text-text-muted hover:text-brand-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <p className="mt-8 border-t border-border pt-4 text-caption text-text-muted">
          © {currentYear} {SITE_CONFIG.name}. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
