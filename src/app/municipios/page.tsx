import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/db/prisma";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  title: "Municípios",
  description: "Cobertura regional organizada por municípios ativos na base editorial do Nossa Voz RO.",
  alternates: {
    canonical: absoluteUrl("/municipios"),
  },
  openGraph: {
    type: "website",
    title: "Municípios",
    description: "Cobertura regional organizada por municípios ativos na base editorial do Nossa Voz RO.",
    url: absoluteUrl("/municipios"),
    images: defaultSocialImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Municípios",
    description: "Cobertura regional organizada por municípios ativos na base editorial do Nossa Voz RO.",
    images: defaultSocialImage().map((image) => image.url),
  },
};

export default async function MunicipiosPage() {
  const [municipalities, grouped] = await Promise.all([
    prisma.municipality.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, region: { select: { name: true } } },
    }),
    prisma.news.groupBy({
      by: ["municipalityId"],
      where: { status: "PUBLISHED", municipalityId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const newsCountByMunicipality = new Map(
    grouped.map((entry) => [entry.municipalityId ?? "", entry._count._all]),
  );

  return (
    <main className="bg-canvas py-6 md:py-8">
      <Container className="space-y-6">
        <SectionHeading
          title="Municipios"
          subtitle="Cobertura regional organizada por municípios ativos na base editorial."
        />

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {municipalities.map((municipality) => (
            <li key={municipality.id} className="surface-card p-4">
              <Link href={`/municipios/${municipality.slug}`} className="inline-flex text-body font-semibold">
                {municipality.name}
              </Link>
              <p className="mt-1 text-caption text-text-muted">
                {municipality.region?.name ?? "Rondônia"} • {newsCountByMunicipality.get(municipality.id) ?? 0} publicadas
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
