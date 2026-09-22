import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { getCategoryBySlug, titleFromSlug } from "@/config/site";

type NewsArticlePageProps = {
  params: Promise<{
    categoria: string;
    slug: string;
  }>;
};

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.categoria);

  if (!category) {
    notFound();
  }

  const articleTitle = titleFromSlug(resolvedParams.slug);

  return (
    <PagePlaceholder
      title={articleTitle || "Noticia"}
      description="Estrutura da pagina de noticia pronta para receber conteudo editorial, autoria, timestamps e blocos relacionados em prompts posteriores."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Noticias", href: "/noticias" },
        { label: category.label, href: category.href },
        { label: articleTitle || "Noticia" },
      ]}
    />
  );
}
