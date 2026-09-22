import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MobileNavigation } from "@/components/public/MobileNavigation";
import { Container } from "@/components/ui/Container";
import { CATEGORY_NAVIGATION, INSTITUTIONAL_NAVIGATION, MAIN_NAVIGATION } from "@/config/site";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          <BrandLogo priority />

          <nav aria-label="Navegacao institucional" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {INSTITUTIONAL_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body-sm font-medium no-underline text-text-muted hover:text-brand-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <MobileNavigation />
        </div>
      </Container>

      <div className="border-t border-border">
        <Container>
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-5 lg:py-3">
            <nav aria-label="Navegacao principal">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {MAIN_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-body-sm font-semibold no-underline text-text hover:text-brand-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Categorias em destaque">
              <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                {CATEGORY_NAVIGATION.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-caption font-semibold uppercase tracking-[0.08em] no-underline text-text-muted hover:text-brand-secondary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
}
