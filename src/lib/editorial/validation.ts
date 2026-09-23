import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isSafeHref(href: string): boolean {
  if (href.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inlineTextNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string().trim().min(1).max(2000),
  emphasis: z.enum(["strong", "em"]).optional(),
});

const inlineLinkNodeSchema = z.object({
  type: z.literal("link"),
  text: z.string().trim().min(1).max(200),
  href: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine((value) => isSafeHref(value), "Link inválido ou inseguro."),
});

const inlineNodeSchema = z.union([inlineTextNodeSchema, inlineLinkNodeSchema]);

const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  content: z.array(inlineNodeSchema).min(1).max(120),
});

const headingBlockSchema = z.object({
  type: z.literal("heading"),
  level: z.union([z.literal(2), z.literal(3)]),
  text: z.string().trim().min(1).max(180),
});

const listBlockSchema = z.object({
  type: z.literal("list"),
  style: z.union([z.literal("unordered"), z.literal("ordered")]),
  items: z.array(z.array(inlineNodeSchema).min(1).max(40)).min(1).max(30),
});

const quoteBlockSchema = z.object({
  type: z.literal("quote"),
  text: z.string().trim().min(1).max(2000),
  citation: z.string().trim().max(200).optional(),
});

export const editorialContentBlockSchema = z.union([
  paragraphBlockSchema,
  headingBlockSchema,
  listBlockSchema,
  quoteBlockSchema,
]);

export const editorialContentBlocksSchema = z.array(editorialContentBlockSchema).min(1).max(200);

export const tagLabelSchema = z.string().trim().min(1).max(48);

export const newsMutationSchema = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(3).max(160).regex(slugRegex, "Slug inválido."),
  summary: z.string().trim().max(320).optional().or(z.literal("")),
  categorySlug: z.string().trim().min(2).max(120).regex(slugRegex, "Categoria inválida."),
  municipalitySlug: z.string().trim().min(2).max(120).regex(slugRegex, "Município inválido."),
  authorId: z.string().trim().min(1).max(120).optional(),
  heroImageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  heroImageAlt: z.string().trim().max(180).optional().or(z.literal("")),
  heroImageCaption: z.string().trim().max(220).optional().or(z.literal("")),
  heroImageCredit: z.string().trim().max(120).optional().or(z.literal("")),
  tags: z.array(tagLabelSchema).max(20),
  blocks: editorialContentBlocksSchema,
  expectedUpdatedAt: z.string().datetime().optional(),
});

export const workflowMutationSchema = z.object({
  to: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]),
  notes: z.string().trim().max(300).optional(),
});

export const adminListFiltersSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  categorySlug: z.string().trim().optional(),
  municipalitySlug: z.string().trim().optional(),
  authorId: z.string().trim().optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export function parseTagInput(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}
