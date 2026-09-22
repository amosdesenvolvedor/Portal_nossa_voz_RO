import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function PoliticaPrivacidadePage() {
  return (
    <PagePlaceholder
      title="Politica de Privacidade"
      description="Pagina estrutural para politicas de privacidade, tratamento de dados e direitos do usuario conforme legislacao aplicavel."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Politica de Privacidade" }]}
    />
  );
}
