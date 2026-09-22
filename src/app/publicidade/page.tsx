import { PagePlaceholder } from "@/components/public/PagePlaceholder";

export default function PublicidadePage() {
  return (
    <PagePlaceholder
      title="Publicidade"
      description="O Nossa Voz RO tera espacos comerciais para anunciantes regionais. Informacoes comerciais e formatos serao disponibilizados em etapa dedicada."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Publicidade" }]}
    />
  );
}
