import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Informações institucionais do portal Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/sobre"),
  },
  openGraph: {
    type: "website",
    title: "Sobre",
    description: "Informações institucionais do portal Nossa Voz RO.",
    url: absoluteUrl("/sobre"),
    images: defaultSocialImage(),
  },
};

export default function SobrePage() {
  return (
    <PagePlaceholder
      title="Sobre"
      description="Pagina institucional base do portal. Conteudo editorial-institucional oficial sera adicionado com aprovacao do responsavel de negocio."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sobre" }]}
    />
  );
}
