import crypto from "node:crypto";
import sharp from "sharp";
import { Prisma, type MediaAsset, type MediaOrigin, type UserRole } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getMediaStorageAdapter } from "@/lib/storage/media-storage";

export const MEDIA_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MEDIA_MAX_WIDTH = 8000;
export const MEDIA_MAX_HEIGHT = 8000;
export const MEDIA_MAX_PIXELS = 40_000_000;

const ALLOWED_OUTPUT_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type MediaActor = {
  id: string;
  role: UserRole;
};

export type NewsMediaInput = {
  assetIds?: string[];
  heroAssetId?: string;
  metadata?: Array<{
    id: string;
    altText?: string;
    caption?: string;
    credit?: string;
    isSensitive?: boolean;
  }>;
};

function isPrivileged(role: UserRole) {
  return role === "ADMIN" || role === "EDITOR";
}

function mediaPublicPath(assetId: string) {
  return `/media/${assetId}`;
}

function toOutputMime(format: string | undefined): "image/jpeg" | "image/png" | "image/webp" {
  if (format === "jpeg" || format === "jpg") {
    return "image/jpeg";
  }

  if (format === "png") {
    return "image/png";
  }

  return "image/webp";
}

async function normalizeImage(buffer: Buffer) {
  const image = sharp(buffer, { failOn: "error" }).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new Error("INVALID_IMAGE");
  }

  if (metadata.width > MEDIA_MAX_WIDTH || metadata.height > MEDIA_MAX_HEIGHT) {
    throw new Error("IMAGE_DIMENSIONS_EXCEEDED");
  }

  if (metadata.width * metadata.height > MEDIA_MAX_PIXELS) {
    throw new Error("IMAGE_PIXELS_EXCEEDED");
  }

  const outputMime = toOutputMime(metadata.format);
  if (!ALLOWED_OUTPUT_MIME.has(outputMime)) {
    throw new Error("UNSUPPORTED_IMAGE_FORMAT");
  }

  let normalizedOriginal: Buffer;
  let normalizedDisplay: Buffer;

  if (outputMime === "image/jpeg") {
    normalizedOriginal = await image.clone().jpeg({ quality: 90, mozjpeg: true }).toBuffer();
    normalizedDisplay = await image.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else if (outputMime === "image/png") {
    normalizedOriginal = await image.clone().png({ compressionLevel: 8 }).toBuffer();
    normalizedDisplay = await image.clone().png({ compressionLevel: 9 }).toBuffer();
  } else {
    normalizedOriginal = await image.clone().webp({ quality: 88 }).toBuffer();
    normalizedDisplay = await image.clone().webp({ quality: 80 }).toBuffer();
  }

  return {
    width: metadata.width,
    height: metadata.height,
    mimeType: outputMime,
    normalizedOriginal,
    normalizedDisplay,
  };
}

function buildStorageKey(prefix: string, extension: string) {
  const random = crypto.randomUUID();
  return `${prefix}/${random}.${extension}`;
}

function extensionFromMime(mimeType: string): string {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  return "webp";
}

export async function createMediaAssetFromUpload(input: {
  actor: MediaActor;
  buffer: Buffer;
  origin: MediaOrigin;
  altText?: string;
  caption?: string;
  credit?: string;
  aiPrompt?: string;
}) {
  if (input.buffer.byteLength > MEDIA_MAX_FILE_SIZE_BYTES) {
    throw new Error("IMAGE_SIZE_EXCEEDED");
  }

  const processed = await normalizeImage(input.buffer);
  const extension = extensionFromMime(processed.mimeType);
  const originalKey = buildStorageKey("original", extension);
  const publicKey = buildStorageKey("display", extension);
  const storage = getMediaStorageAdapter();

  await storage.write({
    key: originalKey,
    buffer: processed.normalizedOriginal,
    contentType: processed.mimeType,
  });

  await storage.write({
    key: publicKey,
    buffer: processed.normalizedDisplay,
    contentType: processed.mimeType,
  });

  const asset = await prisma.mediaAsset.create({
    data: {
      origin: input.origin,
      storageKeyOriginal: originalKey,
      storageKeyPublic: publicKey,
      mimeType: processed.mimeType,
      width: processed.width,
      height: processed.height,
      fileSize: processed.normalizedDisplay.byteLength,
      altText: input.altText?.trim() || null,
      caption: input.caption?.trim() || null,
      credit: input.credit?.trim() || null,
      aiPrompt: input.aiPrompt?.trim() || null,
      createdById: input.actor.id,
    },
  });

  return {
    asset,
    publicUrl: mediaPublicPath(asset.id),
  };
}

async function ensureAssetEditable(assetId: string, actor: MediaActor, tx: Prisma.TransactionClient) {
  const asset = await tx.mediaAsset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    throw new Error("NOT_FOUND");
  }

  if (!isPrivileged(actor.role) && asset.createdById !== actor.id) {
    throw new Error("FORBIDDEN");
  }

  return asset;
}

export async function updateMediaAssetMetadata(assetId: string, actor: MediaActor, input: {
  altText?: string;
  caption?: string;
  credit?: string;
  isSensitive?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    await ensureAssetEditable(assetId, actor, tx);

    const updated = await tx.mediaAsset.update({
      where: { id: assetId },
      data: {
        altText: input.altText?.trim() || null,
        caption: input.caption?.trim() || null,
        credit: input.credit?.trim() || null,
        isSensitive: typeof input.isSensitive === "boolean" ? input.isSensitive : undefined,
      },
    });

    return {
      asset: updated,
      publicUrl: mediaPublicPath(updated.id),
    };
  });
}

export async function setMediaAssetBlur(assetId: string, actor: MediaActor, shouldBlur: boolean) {
  return prisma.$transaction(async (tx) => {
    const asset = await ensureAssetEditable(assetId, actor, tx);

    if (!shouldBlur) {
      const unblurred = await tx.mediaAsset.update({
        where: { id: asset.id },
        data: {
          storageKeyPublic: asset.storageKeyOriginal,
          isBlurred: false,
        },
      });

      return {
        asset: unblurred,
        publicUrl: mediaPublicPath(unblurred.id),
      };
    }

    const storage = getMediaStorageAdapter();
    const original = await storage.read(asset.storageKeyOriginal);
    const blurredBuffer = await sharp(original.buffer).blur(22).toBuffer();
    const extension = extensionFromMime(asset.mimeType);
    const blurredKey = buildStorageKey("display", extension);

    await storage.write({
      key: blurredKey,
      buffer: blurredBuffer,
      contentType: asset.mimeType,
    });

    const blurred = await tx.mediaAsset.update({
      where: { id: asset.id },
      data: {
        storageKeyPublic: blurredKey,
        isBlurred: true,
      },
    });

    return {
      asset: blurred,
      publicUrl: mediaPublicPath(blurred.id),
    };
  });
}

async function ensureNewsEditable(newsId: string, actor: MediaActor, tx: Prisma.TransactionClient) {
  const current = await tx.news.findUnique({
    where: { id: newsId },
    select: {
      id: true,
      createdById: true,
      authorId: true,
    },
  });

  if (!current) {
    throw new Error("NOT_FOUND");
  }

  if (!isPrivileged(actor.role) && current.createdById !== actor.id && current.authorId !== actor.id) {
    throw new Error("FORBIDDEN");
  }

  return current;
}

export async function syncNewsMedia(newsId: string, actor: MediaActor, input: NewsMediaInput | undefined) {
  if (!input) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    await ensureNewsEditable(newsId, actor, tx);

    const assetIds = Array.from(new Set((input.assetIds || []).map((id) => id.trim()).filter(Boolean)));
    if (assetIds.length > 0) {
      const foundAssets = await tx.mediaAsset.findMany({
        where: {
          id: { in: assetIds },
          ...(isPrivileged(actor.role) ? {} : { createdById: actor.id }),
        },
        select: { id: true },
      });

      if (foundAssets.length !== assetIds.length) {
        throw new Error("FORBIDDEN");
      }
    }

    const existingLinks = await tx.newsMediaAsset.findMany({
      where: { newsId },
      select: { id: true, mediaAssetId: true },
    });

    const existingByAsset = new Map(existingLinks.map((link) => [link.mediaAssetId, link]));

    for (let index = 0; index < assetIds.length; index += 1) {
      const assetId = assetIds[index];
      const existing = existingByAsset.get(assetId);

      if (existing) {
        await tx.newsMediaAsset.update({
          where: { id: existing.id },
          data: { sortOrder: index },
        });
      } else {
        await tx.newsMediaAsset.create({
          data: {
            newsId,
            mediaAssetId: assetId,
            addedById: actor.id,
            sortOrder: index,
          },
        });
      }
    }

    const toRemove = existingLinks.filter((item) => !assetIds.includes(item.mediaAssetId));
    if (toRemove.length > 0) {
      await tx.newsMediaAsset.deleteMany({
        where: {
          id: { in: toRemove.map((item) => item.id) },
        },
      });
    }

    if (input.metadata && input.metadata.length > 0) {
      for (const item of input.metadata) {
        const allowed = isPrivileged(actor.role)
          ? { id: item.id }
          : { id: item.id, createdById: actor.id };

        await tx.mediaAsset.updateMany({
          where: allowed,
          data: {
            altText: item.altText?.trim() || null,
            caption: item.caption?.trim() || null,
            credit: item.credit?.trim() || null,
            isSensitive: typeof item.isSensitive === "boolean" ? item.isSensitive : undefined,
          },
        });
      }
    }

    const heroAssetId = input.heroAssetId?.trim();
    let heroMediaAssetId: string | null = null;
    let heroImageUrl: string | null = null;
    let heroImageAlt: string | null = null;
    let heroImageCaption: string | null = null;
    let heroImageCredit: string | null = null;

    if (heroAssetId) {
      if (!assetIds.includes(heroAssetId)) {
        throw new Error("VALIDATION_ERROR: imagem principal deve estar associada à notícia.");
      }

      const heroAsset = await tx.mediaAsset.findUnique({
        where: { id: heroAssetId },
      });

      if (!heroAsset) {
        throw new Error("NOT_FOUND");
      }

      heroMediaAssetId = heroAsset.id;
      heroImageUrl = mediaPublicPath(heroAsset.id);
      heroImageAlt = heroAsset.altText;
      heroImageCaption = heroAsset.caption;
      heroImageCredit = heroAsset.credit;
    }

    await tx.news.update({
      where: { id: newsId },
      data: {
        heroMediaAssetId,
        heroImageUrl,
        heroImageAlt,
        heroImageCaption,
        heroImageCredit,
      },
    });

    await tx.editorialAuditEvent.create({
      data: {
        articleId: newsId,
        actorId: actor.id,
        action: "UPDATED",
        notes: "MEDIA_SYNC",
      },
    });

    const linked = await tx.newsMediaAsset.findMany({
      where: { newsId },
      orderBy: { sortOrder: "asc" },
      include: {
        mediaAsset: true,
      },
    });

    return {
      heroMediaAssetId,
      items: linked.map((item) => ({
        id: item.mediaAsset.id,
        origin: item.mediaAsset.origin,
        mimeType: item.mediaAsset.mimeType,
        width: item.mediaAsset.width,
        height: item.mediaAsset.height,
        fileSize: item.mediaAsset.fileSize,
        altText: item.mediaAsset.altText,
        caption: item.mediaAsset.caption,
        credit: item.mediaAsset.credit,
        isSensitive: item.mediaAsset.isSensitive,
        isBlurred: item.mediaAsset.isBlurred,
        publicUrl: mediaPublicPath(item.mediaAsset.id),
        sortOrder: item.sortOrder,
      })),
    };
  });
}

export async function getPublicMediaAssetById(id: string): Promise<Pick<MediaAsset, "id" | "mimeType" | "storageKeyPublic" | "updatedAt"> | null> {
  return prisma.mediaAsset.findUnique({
    where: { id },
    select: {
      id: true,
      mimeType: true,
      storageKeyPublic: true,
      updatedAt: true,
    },
  });
}

export async function readMediaPublicBuffer(storageKeyPublic: string) {
  const storage = getMediaStorageAdapter();
  return storage.read(storageKeyPublic);
}
