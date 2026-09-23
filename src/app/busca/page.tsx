import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { NO_INDEX_FOLLOW, defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Busca",
  description: "Busca interna de conteúdos do Nossa Voz RO.",
  robots: NO_INDEX_FOLLOW,
  alternates: {
    canonical: absoluteUrl("/busca"),
  },
  openGraph: {
    type: "website",
    title: "Busca",
    description: "Busca interna de conteúdos do Nossa Voz RO.",
    url: absoluteUrl("/busca"),
    images: defaultSocialImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Busca",
    description: "Busca interna de conteúdos do Nossa Voz RO.",
    images: defaultSocialImage().map((image) => image.url),
  },
};

export default function BuscaPage() {
  return (
    <PagePlaceholder
      title="Busca"
      description="A rota de busca publica ja esta disponivel. O mecanismo completo de busca e relevancia sera integrado em prompt futuro."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Busca" }]}
    />
  );
}
