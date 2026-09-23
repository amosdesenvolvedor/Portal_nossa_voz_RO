import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canal institucional de contato do Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/contato"),
  },
  openGraph: {
    type: "website",
    title: "Contato",
    description: "Canal institucional de contato do Nossa Voz RO.",
    url: absoluteUrl("/contato"),
    images: defaultSocialImage(),
  },
};

export default function ContatoPage() {
  return (
    <PagePlaceholder
      title="Contato"
      description="Canal institucional para comunicacao com o portal. Dados oficiais de contato serao configurados posteriormente no painel administrativo."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contato" }]}
    />
  );
}
