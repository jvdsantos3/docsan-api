/*
  Warnings:

  - A unique constraint covering the columns `[registryTypeId]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registryTypeId` to the `professionals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."action_logs" ADD COLUMN     "registryTypeId" TEXT;

-- AlterTable
ALTER TABLE "public"."professionals" ADD COLUMN     "registryTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."registry_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registry_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_registryTypeId_key" ON "public"."professionals"("registryTypeId");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_registryTypeId_fkey" FOREIGN KEY ("registryTypeId") REFERENCES "public"."registry_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_logs" ADD CONSTRAINT "action_logs_registryTypeId_fkey" FOREIGN KEY ("registryTypeId") REFERENCES "public"."registry_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
