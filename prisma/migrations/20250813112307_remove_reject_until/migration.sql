/*
  Warnings:

  - You are about to drop the column `rejectedUntil` on the `ProfessionalStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedUntil` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProfessionalStatusHistory" DROP COLUMN "rejectedUntil";

-- AlterTable
ALTER TABLE "public"."professionals" DROP COLUMN "rejectedUntil";
