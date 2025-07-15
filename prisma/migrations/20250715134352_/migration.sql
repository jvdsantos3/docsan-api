/*
  Warnings:

  - You are about to drop the column `active` on the `document_types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "document_types" DROP COLUMN "active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
