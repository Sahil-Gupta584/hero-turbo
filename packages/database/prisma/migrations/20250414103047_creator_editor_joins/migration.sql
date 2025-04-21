/*
  Warnings:

  - You are about to drop the column `creatorId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_creatorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "creatorId";

-- CreateTable
CREATE TABLE "CreatorEditor" (
    "creatorId" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorEditor_pkey" PRIMARY KEY ("creatorId","editorId")
);

-- AddForeignKey
ALTER TABLE "CreatorEditor" ADD CONSTRAINT "CreatorEditor_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorEditor" ADD CONSTRAINT "CreatorEditor_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
