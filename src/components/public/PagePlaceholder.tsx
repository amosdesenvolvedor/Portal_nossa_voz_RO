import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/public/Breadcrumbs";
import { Container } from "@/components/ui/Container";

type PagePlaceholderProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
};

export function PagePlaceholder({ title, description, breadcrumbs, children }: PagePlaceholderProps) {
  return (
    <main className="bg-canvas py-10 md:py-14">
      <Container className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />
        <section className="surface-card space-y-4 p-6 md:p-8">
          <h1 className="text-h1">{title}</h1>
          <p className="max-w-reading text-body-lg text-text-muted">{description}</p>
          {children ? <div className="pt-2">{children}</div> : null}
        </section>
      </Container>
    </main>
  );
}
