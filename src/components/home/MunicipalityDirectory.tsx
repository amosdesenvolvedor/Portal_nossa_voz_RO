import Link from "next/link";

type MunicipalityDirectoryProps = {
  items: Array<{ name: string; href: string }>;
};

export function MunicipalityDirectory({ items }: MunicipalityDirectoryProps) {
  return (
    <section className="space-y-4" aria-labelledby="municipios-home">
      <header className="space-y-1">
        <h2 id="municipios-home" className="text-h2">
          Municipios em destaque
        </h2>
        <p className="text-body-sm text-text-muted">Acesso rapido para paginas municipais. Lista demonstrativa para evolucao futura.</p>
      </header>

      <ul className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-sm border border-border bg-surface px-3 py-2 text-body-sm font-semibold no-underline text-text hover:bg-surface-secondary"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
