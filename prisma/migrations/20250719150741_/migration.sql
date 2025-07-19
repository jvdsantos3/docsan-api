/*
  Warnings:

  - You are about to drop the column `professional_id` on the `indexations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document_type_id,version]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `version` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "version" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "indexations" DROP COLUMN "professional_id";

-- CreateIndex
CREATE UNIQUE INDEX "documents_document_type_id_version_key" ON "documents"("document_type_id", "version");
