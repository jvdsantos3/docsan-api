/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `registry_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "registry_types_name_key" ON "public"."registry_types"("name");
