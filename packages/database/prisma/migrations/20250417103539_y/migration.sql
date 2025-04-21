/*
  Warnings:

  - Added the required column `editorEmail` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "editorEmail" TEXT NOT NULL;
