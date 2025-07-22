/*
  Warnings:

  - You are about to drop the column `professional_id` on the `document_types` table. All the data in the column will be lost.
  - You are about to drop the column `indexation_id` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `professional_id` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `document_type_id` on the `indexations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document_id]` on the table `indexations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document_id` to the `indexations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_indexation_id_fkey";

-- DropForeignKey
ALTER TABLE "indexations" DROP CONSTRAINT "indexations_document_type_id_fkey";

-- DropIndex
DROP INDEX "documents_indexation_id_key";

-- AlterTable
ALTER TABLE "document_types" DROP COLUMN "professional_id";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "indexation_id",
DROP COLUMN "professional_id";

-- AlterTable
ALTER TABLE "indexations" DROP COLUMN "document_type_id",
ADD COLUMN     "document_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "indexations_document_id_key" ON "indexations"("document_id");

-- AddForeignKey
ALTER TABLE "indexations" ADD CONSTRAINT "indexations_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
