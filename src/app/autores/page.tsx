import Link from "next/link";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function AutoresPage() {
  return (
    <PagePlaceholder
      title="Autores"
      description="Pagina estrutural para listar autores do portal com biografia, foto e materias publicadas."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Autores" }]}
    >
      <p className="text-body-sm text-text-muted">
        Perfis oficiais de autores serao cadastrados posteriormente. Estrutura dinamica pronta para rotas por slug.
      </p>
      <Link href="/autores/exemplo" className="mt-2 inline-flex text-body-sm font-semibold">
        Visualizar rota estrutural de autor
      </Link>
    </PagePlaceholder>
  );
}
