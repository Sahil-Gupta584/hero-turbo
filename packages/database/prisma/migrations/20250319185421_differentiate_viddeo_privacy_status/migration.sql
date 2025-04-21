/*
  Warnings:

  - The `privacyStatus` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PrivacyStatus" AS ENUM ('Private', 'Public', 'Unlisted');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "videoStatus" "VideoStatus" NOT NULL DEFAULT 'DRAFT',
DROP COLUMN "privacyStatus",
ADD COLUMN     "privacyStatus" "PrivacyStatus" NOT NULL DEFAULT 'Private';
