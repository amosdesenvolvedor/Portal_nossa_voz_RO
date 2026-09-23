import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Publicidade",
  description: "Informações comerciais e publicitárias do portal Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/publicidade"),
  },
  openGraph: {
    type: "website",
    title: "Publicidade",
    description: "Informações comerciais e publicitárias do portal Nossa Voz RO.",
    url: absoluteUrl("/publicidade"),
    images: defaultSocialImage(),
  },
};

export default function PublicidadePage() {
  return (
    <PagePlaceholder
      title="Publicidade"
      description="O Nossa Voz RO tera espacos comerciais para anunciantes regionais. Informacoes comerciais e formatos serao disponibilizados em etapa dedicada."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Publicidade" }]}
    />
  );
}
