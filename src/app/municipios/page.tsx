import Link from "next/link";
import { PagePlaceholder } from "@/components/public/PagePlaceholder";
import { FEATURED_MUNICIPALITY_NAVIGATION } from "@/config/site";

export default function MunicipiosPage() {
  return (
    <PagePlaceholder
      title="Municipios"
      description="Pagina estrutural para cobertura regional. O cadastro de municipios sera dinamico e administravel em etapas futuras."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Municipios" }]}
    >
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_MUNICIPALITY_NAVIGATION.map((municipality) => (
          <li key={municipality.href}>
            <Link href={municipality.href} className="inline-flex text-body-sm font-semibold">
              {municipality.label}
            </Link>
          </li>
        ))}
      </ul>
    </PagePlaceholder>
  );
}
