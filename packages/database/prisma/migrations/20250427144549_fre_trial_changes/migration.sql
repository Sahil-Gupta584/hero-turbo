/*
  Warnings:

  - The values [FREE,BUSINESS] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('BASE', 'PRO', 'GROWTH', 'ENTERPRISE');
ALTER TABLE "User" ALTER COLUMN "plan" TYPE "PlanType_new" USING ("plan"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "PlanType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trialEndAt" TEXT;
