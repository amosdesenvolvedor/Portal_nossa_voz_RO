import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { titleFromSlug } from "@/config/site";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const authorName = titleFromSlug(resolvedParams.slug);

  return (
    <PagePlaceholder
      title={authorName || "Autor"}
      description="Estrutura de pagina de autor pronta para receber nome, foto, biografia e lista de noticias assinadas."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Autores", href: "/autores" },
        { label: authorName || "Autor" },
      ]}
    />
  );
}
