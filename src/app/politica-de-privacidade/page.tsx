import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function PoliticaPrivacidadePage() {
  return (
    <PagePlaceholder
      title="Política de Privacidade"
      description="Página estrutural para políticas de privacidade, tratamento de dados e direitos do usuário conforme legislação aplicável."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Política de Privacidade" }]}
    />
  );
}
