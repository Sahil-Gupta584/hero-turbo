/*
  Warnings:

  - You are about to drop the column `token` on the `Invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invite_token_key";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "token";

-- CreateIndex
CREATE UNIQUE INDEX "Invite_id_key" ON "Invite"("id");
