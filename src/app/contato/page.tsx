import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function ContatoPage() {
  return (
    <PagePlaceholder
      title="Contato"
      description="Canal institucional para comunicacao com o portal. Dados oficiais de contato serao configurados posteriormente no painel administrativo."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contato" }]}
    />
  );
}
