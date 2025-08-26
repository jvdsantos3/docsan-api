/*
  Warnings:

  - A unique constraint covering the columns `[name,branchActivityId]` on the table `registry_types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."registry_types_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "registry_types_name_branchActivityId_key" ON "public"."registry_types"("name", "branchActivityId");
