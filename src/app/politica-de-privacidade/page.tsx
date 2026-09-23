import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade e tratamento de dados do portal Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/politica-de-privacidade"),
  },
  openGraph: {
    type: "website",
    title: "Política de Privacidade",
    description: "Política de privacidade e tratamento de dados do portal Nossa Voz RO.",
    url: absoluteUrl("/politica-de-privacidade"),
    images: defaultSocialImage(),
  },
};

export default function PoliticaPrivacidadePage() {
  return (
    <PagePlaceholder
      title="Política de Privacidade"
      description="Página estrutural para políticas de privacidade, tratamento de dados e direitos do usuário conforme legislação aplicável."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Política de Privacidade" }]}
    />
  );
}
