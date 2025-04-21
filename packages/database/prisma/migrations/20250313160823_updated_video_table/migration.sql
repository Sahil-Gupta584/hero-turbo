-- AlterEnum
ALTER TYPE "VideoStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "thumbnailUrl" TEXT,
ALTER COLUMN "title" DROP NOT NULL;
