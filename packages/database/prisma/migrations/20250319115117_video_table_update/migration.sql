/*
  Warnings:

  - You are about to drop the column `status` on the `Video` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Made the column `thumbnailUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "status",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "playlistIds" INTEGER[],
ADD COLUMN     "privacyStatus" "VideoStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" TEXT NOT NULL,
ALTER COLUMN "thumbnailUrl" SET NOT NULL;
