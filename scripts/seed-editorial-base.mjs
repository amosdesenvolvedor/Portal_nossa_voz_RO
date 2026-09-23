import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  "Notícias locais",
  "Política",
  "Polícia",
  "Saúde",
  "Educação",
  "Esportes",
  "Economia",
  "Agricultura",
  "Cultura",
  "Eventos",
  "Empregos",
  "Classificados",
];

const TAGS = ["jornalismo regional", "nossa voz ro", "rondonia", "validacao editorial"];

const REGIONS = [
  { name: "Zona da Mata", slug: "zona-da-mata" },
  { name: "BR-429", slug: "br-429" },
];

const MUNICIPALITIES = [
  {
    name: "Rolim de Moura",
    slug: "rolim-de-moura",
    regionSlug: "zona-da-mata",
    featured: true,
  },
  {
    name: "Alta Floresta d'Oeste",
    slug: "alta-floresta-doeste",
    regionSlug: "zona-da-mata",
    featured: true,
  },
  {
    name: "São Miguel do Guaporé",
    slug: "sao-miguel-do-guapore",
    regionSlug: "zona-da-mata",
    featured: true,
  },
];

function toSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  for (const region of REGIONS) {
    await prisma.region.upsert({
      where: { slug: region.slug },
      update: { name: region.name },
      create: { name: region.name, slug: region.slug },
    });
  }

  const regionBySlug = new Map(
    (await prisma.region.findMany({ select: { id: true, slug: true } })).map((region) => [region.slug, region.id]),
  );

  for (const municipality of MUNICIPALITIES) {
    await prisma.municipality.upsert({
      where: { slug: municipality.slug },
      update: {
        name: municipality.name,
        regionId: regionBySlug.get(municipality.regionSlug) ?? null,
        isActive: true,
        featured: municipality.featured,
      },
      create: {
        name: municipality.name,
        slug: municipality.slug,
        regionId: regionBySlug.get(municipality.regionSlug) ?? null,
        isActive: true,
        featured: municipality.featured,
      },
    });
  }

  for (const category of CATEGORIES) {
    const slug = toSlug(category);

    await prisma.category.upsert({
      where: { slug },
      update: { name: category, isActive: true },
      create: { name: category, slug, isActive: true },
    });
  }

  for (const tag of TAGS) {
    const slug = toSlug(tag);

    await prisma.tag.upsert({
      where: { slug },
      update: { name: tag },
      create: { name: tag, slug },
    });
  }

  console.log("Seed editorial base concluído.");
}

main()
  .catch((error) => {
    console.error("Falha no seed editorial base:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
