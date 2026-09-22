import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function BuscaPage() {
  return (
    <PagePlaceholder
      title="Busca"
      description="A rota de busca publica ja esta disponivel. O mecanismo completo de busca e relevancia sera integrado em prompt futuro."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Busca" }]}
    />
  );
}
