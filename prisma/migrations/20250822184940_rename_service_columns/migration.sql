/*
  Warnings:

  - You are about to drop the column `active` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."services" DROP COLUMN "active",
DROP COLUMN "featured",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_highlighted" BOOLEAN NOT NULL DEFAULT false;
