import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function SobrePage() {
  return (
    <PagePlaceholder
      title="Sobre"
      description="Pagina institucional base do portal. Conteudo editorial-institucional oficial sera adicionado com aprovacao do responsavel de negocio."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sobre" }]}
    />
  );
}
