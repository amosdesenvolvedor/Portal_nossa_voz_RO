import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { getCategoryBySlug } from "@/config/site";

type CategoryPageProps = {
  params: Promise<{
    categoria: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.categoria);

  if (!category) {
    notFound();
  }

  return (
    <PagePlaceholder
      title={category.label}
      description="Pagina de categoria preparada para receber listagem paginada, filtros editoriais e metadata dinamica."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Noticias", href: "/noticias" },
        { label: category.label },
      ]}
    />
  );
}
