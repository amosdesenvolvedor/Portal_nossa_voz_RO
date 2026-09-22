import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { titleFromSlug } from "@/config/site";

type MunicipalityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const resolvedParams = await params;
  const municipalityName = titleFromSlug(resolvedParams.slug);

  return (
    <PagePlaceholder
      title={municipalityName || "Municipio"}
      description="Estrutura preparada para receber descricao do municipio, regiao, informacoes de estado e noticias relacionadas."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Municipios", href: "/municipios" },
        { label: municipalityName || "Municipio" },
      ]}
    />
  );
}
