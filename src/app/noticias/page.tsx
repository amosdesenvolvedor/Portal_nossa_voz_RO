import Link from "next/link";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { CATEGORY_NAVIGATION } from "@/config/site";

export default function NoticiasPage() {
  return (
    <PagePlaceholder
      title="Noticias"
      description="Estrutura editorial publica para listagem geral de noticias. A integracao com dados reais sera feita em prompts futuros."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Noticias" }]}
    >
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_NAVIGATION.map((category) => (
          <li key={category.slug}>
            <Link href={category.href} className="inline-flex text-body-sm font-semibold">
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </PagePlaceholder>
  );
}
