/*
  Warnings:

  - Changed the type of `metadata` on the `document_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "document_types" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB NOT NULL;
