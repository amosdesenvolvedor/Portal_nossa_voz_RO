import { Prisma, type EditorialAuditAction, type NewsStatus, type UserRole } from "@prisma/client";
import { toUrlSlug } from "@/config/site";
import { canTransitionStatus } from "@/lib/auth/policies";
import { prisma } from "@/lib/db/prisma";
import {
  adminListFiltersSchema,
  newsMutationSchema,
  parseTagInput,
  tagLabelSchema,
  workflowMutationSchema,
} from "@/lib/editorial/validation";
import { syncNewsMedia, type NewsMediaInput } from "@/lib/media/editorial-media";

export type ServiceActor = {
  id: string;
  role: UserRole;
};

function isPrivilegedEditorialRole(role: UserRole) {
  return role === "EDITOR" || role === "ADMIN";
}

export type AdminNewsListItem = {
  id: string;
  title: string;
  slug: string;
  status: NewsStatus;
  category: string;
  categorySlug: string;
  municipality: string;
  municipalitySlug: string;
  author: string;
  authorId: string | null;
  updatedAtISO: string;
};

type NewsMutationInput = {
  title: string;
  slug: string;
  summary: string | null;
  contentBlocks: Prisma.JsonArray;
  content: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  heroImageCaption: string | null;
  heroImageCredit: string | null;
  isAiAssisted: boolean;
  media?: NewsMediaInput;
};

function toPlainTextFromBlocks(blocks: Prisma.JsonValue): string {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") {
        return "";
      }

      const typedBlock = block as Record<string, unknown>;

      if (typedBlock.type === "heading") {
        return String(typedBlock.text ?? "");
      }

      if (typedBlock.type === "quote") {
        const citation = String(typedBlock.citation ?? "");
        const text = String(typedBlock.text ?? "");
        return [text, citation].filter(Boolean).join(" - ");
      }

      if (typedBlock.type === "list" && Array.isArray(typedBlock.items)) {
        return typedBlock.items
          .map((line) => (Array.isArray(line) ? line.map((node) => String((node as { text?: string }).text ?? "")).join(" ") : ""))
          .join("\n");
      }

      if (typedBlock.type === "paragraph" && Array.isArray(typedBlock.content)) {
        return typedBlock.content.map((node) => String((node as { text?: string }).text ?? "")).join(" ");
      }

      return "";
    })
    .join("\n\n")
    .trim();
}

function actionForTransition(from: NewsStatus, to: NewsStatus): EditorialAuditAction {
  if (from === "DRAFT" && to === "IN_REVIEW") {
    return "SUBMITTED_FOR_REVIEW";
  }

  if (from === "IN_REVIEW" && to === "DRAFT") {
    return "RETURNED_TO_DRAFT";
  }

  if (from === "IN_REVIEW" && to === "PUBLISHED") {
    return "PUBLISHED";
  }

  if (from === "PUBLISHED" && to === "ARCHIVED") {
    return "ARCHIVED";
  }

  if (from === "ARCHIVED" && to === "DRAFT") {
    return "RETURNED_TO_DRAFT";
  }

  return "UPDATED";
}

async function upsertTags(tx: Prisma.TransactionClient, tags: string[]) {
  if (tags.length === 0) {
    return [];
  }

  const normalized = Array.from(
    new Set(tags.map((tag) => tagLabelSchema.parse(tag).toLowerCase())),
  );

  for (const tag of normalized) {
    await tx.tag.upsert({
      where: { slug: toUrlSlug(tag) },
      update: { name: tag },
      create: { name: tag, slug: toUrlSlug(tag) },
    });
  }

  return tx.tag.findMany({
    where: {
      slug: { in: normalized.map((tag) => toUrlSlug(tag)) },
    },
    select: { id: true },
  });
}

async function createAuditEvent(
  tx: Prisma.TransactionClient,
  input: {
    articleId: string;
    actorId: string;
    action: EditorialAuditAction;
    fromStatus?: NewsStatus;
    toStatus?: NewsStatus;
    notes?: string;
  },
) {
  await tx.editorialAuditEvent.create({
    data: {
      articleId: input.articleId,
      actorId: input.actorId,
      action: input.action,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      notes: input.notes,
    },
  });
}

function mapAdminNewsItem(news: {
  id: string;
  title: string;
  slug: string;
  status: NewsStatus;
  updatedAt: Date;
  category: { name: string; slug: string } | null;
  municipality: { name: string; slug: string } | null;
  author: { id: string; name: string } | null;
  createdBy: { name: string };
}): AdminNewsListItem {
  return {
    id: news.id,
    title: news.title,
    slug: news.slug,
    status: news.status,
    category: news.category?.name ?? "Sem categoria",
    categorySlug: news.category?.slug ?? "",
    municipality: news.municipality?.name ?? "Sem município",
    municipalitySlug: news.municipality?.slug ?? "",
    author: news.author?.name ?? news.createdBy.name,
    authorId: news.author?.id ?? null,
    updatedAtISO: news.updatedAt.toISOString(),
  };
}

export async function listAdminReferenceData() {
  const [categories, municipalities, authors] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.municipality.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.user.findMany({
      where: {
        OR: [{ isAuthorProfileActive: true }, { role: "AUTHOR" }, { role: "EDITOR" }],
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return {
    categories,
    municipalities,
    authors,
  };
}

export async function listAdminNews(rawFilters: unknown, actor: ServiceActor) {
  const filters = adminListFiltersSchema.parse(rawFilters ?? {});

  const where: Prisma.NewsWhereInput = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.municipalitySlug ? { municipality: { slug: filters.municipalitySlug } } : {}),
    ...(filters.authorId ? { authorId: filters.authorId } : {}),
    ...(filters.q
      ? {
          title: {
            contains: filters.q,
            mode: "insensitive",
          },
        }
      : {}),
  };

  if (!isPrivilegedEditorialRole(actor.role)) {
    where.OR = [{ createdById: actor.id }, { authorId: actor.id }];
  }

  const [total, rows] = await Promise.all([
    prisma.news.count({ where }),
    prisma.news.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        category: { select: { name: true, slug: true } },
        municipality: { select: { name: true, slug: true } },
        author: { select: { id: true, name: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ]);

  return {
    items: rows.map(mapAdminNewsItem),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
  };
}

export async function getAdminNewsStatusCounts() {
  const grouped = await prisma.news.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = {
    DRAFT: 0,
    IN_REVIEW: 0,
    PUBLISHED: 0,
    ARCHIVED: 0,
  } satisfies Record<NewsStatus, number>;

  for (const row of grouped) {
    counts[row.status] = row._count._all;
  }

  return counts;
}

export async function getAdminNewsById(id: string, actor: ServiceActor) {
  return prisma.news.findFirst({
    where: isPrivilegedEditorialRole(actor.role)
      ? { id }
      : {
          id,
          OR: [{ createdById: actor.id }, { authorId: actor.id }],
        },
    include: {
      category: true,
      municipality: true,
      region: true,
      tags: true,
      author: {
        select: {
          id: true,
          name: true,
          publicSlug: true,
        },
      },
      createdBy: { select: { id: true, name: true } },
      updatedBy: { select: { id: true, name: true } },
      reviewedBy: { select: { id: true, name: true } },
      publishedBy: { select: { id: true, name: true } },
      heroMediaAsset: {
        select: {
          id: true,
          origin: true,
          mimeType: true,
          width: true,
          height: true,
          fileSize: true,
          altText: true,
          caption: true,
          credit: true,
          isSensitive: true,
          isBlurred: true,
        },
      },
      mediaLinks: {
        orderBy: { sortOrder: "asc" },
        include: {
          mediaAsset: {
            select: {
              id: true,
              origin: true,
              mimeType: true,
              width: true,
              height: true,
              fileSize: true,
              altText: true,
              caption: true,
              credit: true,
              isSensitive: true,
              isBlurred: true,
            },
          },
        },
      },
      auditEvents: {
        orderBy: { createdAt: "desc" },
        include: {
          actor: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });
}

function buildNewsMutationData(parsed: ReturnType<typeof newsMutationSchema.parse>): NewsMutationInput {
  return {
    title: parsed.title,
    slug: parsed.slug,
    summary: parsed.summary || null,
    contentBlocks: parsed.blocks as Prisma.JsonArray,
    content: toPlainTextFromBlocks(parsed.blocks as Prisma.JsonArray),
    heroImageUrl: parsed.heroImageUrl || null,
    heroImageAlt: parsed.heroImageAlt || null,
    heroImageCaption: parsed.heroImageCaption || null,
    heroImageCredit: parsed.heroImageCredit || null,
    isAiAssisted: false,
    media: parsed.media,
  };
}

export async function createDraftNews(rawInput: unknown, actor: ServiceActor) {
  const parsed = newsMutationSchema.parse(rawInput);

  if (!isPrivilegedEditorialRole(actor.role) && parsed.authorId && parsed.authorId !== actor.id) {
    throw new Error("FORBIDDEN");
  }

  const created = await prisma.$transaction(async (tx) => {
    const [category, municipality, tags] = await Promise.all([
      tx.category.findUnique({ where: { slug: parsed.categorySlug }, select: { id: true } }),
      tx.municipality.findUnique({ where: { slug: parsed.municipalitySlug }, select: { id: true } }),
      upsertTags(tx, parsed.tags),
    ]);

    if (!category || !municipality) {
      throw new Error("VALIDATION_ERROR: categoria ou município inválido.");
    }

    if (parsed.authorId) {
      const author = await tx.user.findUnique({
        where: { id: parsed.authorId },
        select: { id: true },
      });

      if (!author) {
        throw new Error("VALIDATION_ERROR: autor inválido.");
      }
    }

    const mutationData = buildNewsMutationData(parsed);

    const news = await tx.news.create({
      data: {
        title: mutationData.title,
        slug: mutationData.slug,
        summary: mutationData.summary,
        contentBlocks: mutationData.contentBlocks,
        content: mutationData.content,
        heroImageUrl: mutationData.heroImageUrl,
        heroImageAlt: mutationData.heroImageAlt,
        heroImageCaption: mutationData.heroImageCaption,
        heroImageCredit: mutationData.heroImageCredit,
        isAiAssisted: mutationData.isAiAssisted,
        status: "DRAFT",
        createdBy: { connect: { id: actor.id } },
        updatedBy: { connect: { id: actor.id } },
        category: { connect: { id: category.id } },
        municipality: { connect: { id: municipality.id } },
        ...(isPrivilegedEditorialRole(actor.role)
          ? parsed.authorId
            ? { author: { connect: { id: parsed.authorId } } }
            : {}
          : { author: { connect: { id: actor.id } } }),
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      select: { id: true, slug: true, status: true, updatedAt: true },
    });

    await createAuditEvent(tx, {
      articleId: news.id,
      actorId: actor.id,
      action: "CREATED",
      toStatus: "DRAFT",
    });

    return {
      news,
      media: mutationData.media,
    };
  });

  if (created.media) {
    await syncNewsMedia(created.news.id, actor, created.media);
  }

  return created.news;
}

export async function updateNewsDraft(newsId: string, rawInput: unknown, actor: ServiceActor) {
  const parsed = newsMutationSchema.parse(rawInput);
  const builtMutationData = buildNewsMutationData(parsed);

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.news.findUnique({
      where: { id: newsId },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        createdById: true,
        authorId: true,
      },
    });

    if (!current) {
      throw new Error("NOT_FOUND");
    }

    if (!isPrivilegedEditorialRole(actor.role)) {
      const canEditOwnRecord = current.createdById === actor.id || current.authorId === actor.id;
      if (!canEditOwnRecord) {
        throw new Error("FORBIDDEN");
      }
    }

    if (parsed.expectedUpdatedAt) {
      const expected = new Date(parsed.expectedUpdatedAt).getTime();
      if (Number.isFinite(expected) && expected !== current.updatedAt.getTime()) {
        throw new Error("CONFLICT");
      }
    }

    const [category, municipality, tags] = await Promise.all([
      tx.category.findUnique({ where: { slug: parsed.categorySlug }, select: { id: true } }),
      tx.municipality.findUnique({ where: { slug: parsed.municipalitySlug }, select: { id: true } }),
      upsertTags(tx, parsed.tags),
    ]);

    if (!category || !municipality) {
      throw new Error("VALIDATION_ERROR: categoria ou município inválido.");
    }

    if (parsed.authorId) {
      const author = await tx.user.findUnique({
        where: { id: parsed.authorId },
        select: { id: true },
      });

      if (!author) {
        throw new Error("VALIDATION_ERROR: autor inválido.");
      }
    }

    const canReassignAuthor = isPrivilegedEditorialRole(actor.role);
    const mutationData: Prisma.NewsUpdateInput = {
      title: builtMutationData.title,
      slug: builtMutationData.slug,
      summary: builtMutationData.summary,
      contentBlocks: builtMutationData.contentBlocks,
      content: builtMutationData.content,
      heroImageUrl: builtMutationData.heroImageUrl,
      heroImageAlt: builtMutationData.heroImageAlt,
      heroImageCaption: builtMutationData.heroImageCaption,
      heroImageCredit: builtMutationData.heroImageCredit,
      isAiAssisted: builtMutationData.isAiAssisted,
      category: { connect: { id: category.id } },
      municipality: { connect: { id: municipality.id } },
      updatedBy: { connect: { id: actor.id } },
      tags: {
        set: tags.map((tag) => ({ id: tag.id })),
      },
    };

    if (canReassignAuthor) {
      mutationData.author = parsed.authorId
        ? { connect: { id: parsed.authorId } }
        : { disconnect: true };
    }

    const news = await tx.news.update({
      where: { id: newsId },
      data: mutationData,
      select: {
        id: true,
        slug: true,
        status: true,
        updatedAt: true,
      },
    });

    await createAuditEvent(tx, {
      articleId: news.id,
      actorId: actor.id,
      action: "UPDATED",
      fromStatus: current.status,
      toStatus: current.status,
    });

    return news;
  });

  if (builtMutationData.media) {
    await syncNewsMedia(newsId, actor, builtMutationData.media);
  }

  return updated;
}

export async function transitionNewsWorkflow(newsId: string, rawInput: unknown, actor: ServiceActor) {
  const parsed = workflowMutationSchema.parse(rawInput);

  return prisma.$transaction(async (tx) => {
    const current = await tx.news.findUnique({
      where: { id: newsId },
      select: { id: true, status: true, createdById: true, authorId: true },
    });

    if (!current) {
      throw new Error("NOT_FOUND");
    }

    if (!isPrivilegedEditorialRole(actor.role)) {
      const canOperate = current.createdById === actor.id || current.authorId === actor.id;
      if (!canOperate) {
        throw new Error("FORBIDDEN");
      }
    }

    if (!canTransitionStatus(actor.role, current.status, parsed.to)) {
      throw new Error("FORBIDDEN");
    }

    const statusData: Prisma.NewsUpdateInput = {
      status: parsed.to,
      updatedBy: { connect: { id: actor.id } },
    };

    if (parsed.to === "IN_REVIEW") {
      statusData.reviewedBy = { connect: { id: actor.id } };
    }

    if (parsed.to === "PUBLISHED") {
      statusData.publishedAt = new Date();
      statusData.publishedBy = { connect: { id: actor.id } };
      statusData.reviewedBy = { connect: { id: actor.id } };
    }

    const updated = await tx.news.update({
      where: { id: newsId },
      data: statusData,
      select: {
        id: true,
        slug: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    await createAuditEvent(tx, {
      articleId: newsId,
      actorId: actor.id,
      action: actionForTransition(current.status, parsed.to),
      fromStatus: current.status,
      toStatus: parsed.to,
      notes: parsed.notes,
    });

    return updated;
  });
}

export async function listReviewQueue() {
  const rows = await prisma.news.findMany({
    where: { status: "IN_REVIEW" },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      category: { select: { name: true, slug: true } },
      municipality: { select: { name: true, slug: true } },
      author: { select: { id: true, name: true } },
      createdBy: { select: { name: true } },
    },
  });

  return rows.map(mapAdminNewsItem);
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(input: { name: string; isActive?: boolean }) {
  const name = input.name.trim();
  const slug = toUrlSlug(name);

  return prisma.category.upsert({
    where: { slug },
    update: { name, isActive: input.isActive ?? true },
    create: { name, slug, isActive: input.isActive ?? true },
  });
}

export async function updateCategory(input: { id: string; name: string; isActive: boolean }) {
  return prisma.category.update({
    where: { id: input.id },
    data: {
      name: input.name.trim(),
      slug: toUrlSlug(input.name.trim()),
      isActive: input.isActive,
    },
  });
}

export async function listMunicipalities() {
  return prisma.municipality.findMany({
    orderBy: { name: "asc" },
    include: { region: true },
  });
}

export async function createMunicipality(input: {
  name: string;
  slug?: string;
  regionName?: string;
  featured?: boolean;
  isActive?: boolean;
}) {
  const name = input.name.trim();
  const slug = input.slug?.trim() || toUrlSlug(name);
  const regionName = input.regionName?.trim();

  let regionId: string | null = null;
  if (regionName) {
    const region = await prisma.region.upsert({
      where: { slug: toUrlSlug(regionName) },
      update: { name: regionName },
      create: { name: regionName, slug: toUrlSlug(regionName) },
      select: { id: true },
    });
    regionId = region.id;
  }

  return prisma.municipality.upsert({
    where: { slug },
    update: {
      name,
      regionId,
      featured: input.featured ?? false,
      isActive: input.isActive ?? true,
    },
    create: {
      name,
      slug,
      regionId,
      featured: input.featured ?? false,
      isActive: input.isActive ?? true,
    },
  });
}

export async function updateMunicipality(input: {
  id: string;
  name: string;
  slug?: string;
  regionName?: string;
  featured: boolean;
  isActive: boolean;
}) {
  const regionName = input.regionName?.trim();
  let regionId: string | null = null;

  if (regionName) {
    const region = await prisma.region.upsert({
      where: { slug: toUrlSlug(regionName) },
      update: { name: regionName },
      create: { name: regionName, slug: toUrlSlug(regionName) },
      select: { id: true },
    });
    regionId = region.id;
  }

  return prisma.municipality.update({
    where: { id: input.id },
    data: {
      name: input.name.trim(),
      slug: input.slug?.trim() || toUrlSlug(input.name.trim()),
      regionId,
      featured: input.featured,
      isActive: input.isActive,
    },
  });
}

export async function listTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function createTag(input: { name: string }) {
  const name = input.name.trim();
  const slug = toUrlSlug(name);

  return prisma.tag.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}

export async function updateTag(input: { id: string; name: string }) {
  const name = input.name.trim();
  const slug = toUrlSlug(name);

  return prisma.tag.update({
    where: { id: input.id },
    data: { name, slug },
  });
}

export async function listAuthors() {
  return prisma.user.findMany({
    where: {
      OR: [{ role: "AUTHOR" }, { role: "EDITOR" }, { role: "ADMIN" }],
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      publicSlug: true,
      bio: true,
      avatarUrl: true,
      isAuthorProfileActive: true,
      _count: { select: { assignedAuthoredNews: true } },
    },
  });
}

export async function createAuthorProfile(input: {
  userId: string;
  displayName: string;
  publicSlug: string;
  bio?: string;
  avatarUrl?: string;
  isActive?: boolean;
}) {
  const existing = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.user.update({
    where: { id: input.userId },
    data: {
      name: input.displayName.trim(),
      publicSlug: toUrlSlug(input.publicSlug.trim()),
      bio: input.bio?.trim() || null,
      avatarUrl: input.avatarUrl?.trim() || null,
      role: "AUTHOR",
      isAuthorProfileActive: input.isActive ?? true,
    },
  });
}

export async function updateAuthorProfile(input: {
  id: string;
  name: string;
  publicSlug?: string;
  bio?: string;
  avatarUrl?: string;
  isAuthorProfileActive: boolean;
}) {
  return prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name.trim(),
      publicSlug: input.publicSlug?.trim() || toUrlSlug(input.name.trim()),
      bio: input.bio?.trim() || null,
      avatarUrl: input.avatarUrl?.trim() || null,
      isAuthorProfileActive: input.isAuthorProfileActive,
    },
  });
}

export async function getPublishedArticleByRoute(categorySlug: string, articleSlug: string) {
  return prisma.news.findFirst({
    where: {
      slug: articleSlug,
      status: "PUBLISHED",
      category: { slug: categorySlug },
    },
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
      heroMediaAsset: true,
      mediaLinks: {
        orderBy: { sortOrder: "asc" },
        include: { mediaAsset: true },
      },
    },
  });
}

export async function getRelatedPublishedArticles(newsId: string, categoryId: string, limit = 3) {
  return prisma.news.findMany({
    where: {
      id: { not: newsId },
      status: "PUBLISHED",
      categoryId,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
    },
  });
}

export async function listPublishedNews(options?: { limit?: number }) {
  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: options?.limit,
  });
}

export async function listPublishedNewsByCategorySlug(categorySlug: string) {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      category: { slug: categorySlug },
    },
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function listPublishedNewsByMunicipalitySlug(slug: string) {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      municipality: { slug },
    },
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function listPublishedNewsByAuthorSlug(authorSlug: string) {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      author: {
        publicSlug: authorSlug,
        isAuthorProfileActive: true,
      },
    },
    include: {
      category: true,
      municipality: true,
      region: true,
      author: true,
      createdBy: true,
      tags: true,
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function listPublicMunicipalities() {
  return prisma.municipality.findMany({
    where: { isActive: true },
    include: {
      region: true,
      _count: {
        select: {
          news: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export async function getPublicMunicipalityBySlug(slug: string) {
  return prisma.municipality.findFirst({
    where: { slug, isActive: true },
    include: { region: true },
  });
}

export async function listPublicAuthors() {
  return prisma.user.findMany({
    where: {
      isAuthorProfileActive: true,
      publicSlug: { not: null },
    },
    select: {
      id: true,
      name: true,
      publicSlug: true,
      bio: true,
      avatarUrl: true,
      role: true,
      _count: {
        select: {
          assignedAuthoredNews: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getPublicAuthorBySlug(slug: string) {
  return prisma.user.findFirst({
    where: {
      publicSlug: slug,
      isAuthorProfileActive: true,
    },
    select: {
      id: true,
      name: true,
      publicSlug: true,
      bio: true,
      avatarUrl: true,
      role: true,
    },
  });
}

export function toDemoTagInput(tagInput: string) {
  return parseTagInput(tagInput);
}
