/*
  Warnings:

  - A unique constraint covering the columns `[publicSlug]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EditorialAuditAction" AS ENUM ('CREATED', 'UPDATED', 'SUBMITTED_FOR_REVIEW', 'RETURNED_TO_DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Municipality" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "contentBlocks" JSONB,
ADD COLUMN     "heroImageAlt" TEXT,
ADD COLUMN     "heroImageCaption" TEXT,
ADD COLUMN     "heroImageCredit" TEXT,
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isAuthorProfileActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicSlug" TEXT;

-- CreateTable
CREATE TABLE "EditorialAuditEvent" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "EditorialAuditAction" NOT NULL,
    "fromStatus" "NewsStatus",
    "toStatus" "NewsStatus",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorialAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EditorialAuditEvent_articleId_createdAt_idx" ON "EditorialAuditEvent"("articleId", "createdAt");

-- CreateIndex
CREATE INDEX "EditorialAuditEvent_actorId_createdAt_idx" ON "EditorialAuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "News_status_publishedAt_idx" ON "News"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "News_categoryId_status_publishedAt_idx" ON "News"("categoryId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "News_municipalityId_status_publishedAt_idx" ON "News"("municipalityId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "News_authorId_status_publishedAt_idx" ON "News"("authorId", "status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicSlug_key" ON "User"("publicSlug");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialAuditEvent" ADD CONSTRAINT "EditorialAuditEvent_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialAuditEvent" ADD CONSTRAINT "EditorialAuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
