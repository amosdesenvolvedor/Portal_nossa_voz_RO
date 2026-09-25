-- CreateEnum
CREATE TYPE "MediaOrigin" AS ENUM ('UPLOADED', 'AI_GENERATED');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "heroMediaAssetId" TEXT;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "origin" "MediaOrigin" NOT NULL,
    "storageKeyOriginal" TEXT NOT NULL,
    "storageKeyPublic" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "credit" TEXT,
    "aiPrompt" TEXT,
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "isBlurred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsMediaAsset" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsMediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKeyOriginal_key" ON "MediaAsset"("storageKeyOriginal");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKeyPublic_key" ON "MediaAsset"("storageKeyPublic");

-- CreateIndex
CREATE INDEX "MediaAsset_origin_createdAt_idx" ON "MediaAsset"("origin", "createdAt");

-- CreateIndex
CREATE INDEX "MediaAsset_createdById_createdAt_idx" ON "MediaAsset"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "NewsMediaAsset_newsId_sortOrder_idx" ON "NewsMediaAsset"("newsId", "sortOrder");

-- CreateIndex
CREATE INDEX "NewsMediaAsset_mediaAssetId_idx" ON "NewsMediaAsset"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsMediaAsset_newsId_mediaAssetId_key" ON "NewsMediaAsset"("newsId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "News_heroMediaAssetId_idx" ON "News"("heroMediaAssetId");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_heroMediaAssetId_fkey" FOREIGN KEY ("heroMediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsMediaAsset" ADD CONSTRAINT "NewsMediaAsset_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsMediaAsset" ADD CONSTRAINT "NewsMediaAsset_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsMediaAsset" ADD CONSTRAINT "NewsMediaAsset_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
