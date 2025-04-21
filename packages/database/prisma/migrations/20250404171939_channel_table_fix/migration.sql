/*
  Warnings:

  - You are about to drop the column `channelDesc` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `description` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_id_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "channelDesc",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
