/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `document_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "document_types"("name");
