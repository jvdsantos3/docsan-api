/*
  Warnings:

  - You are about to drop the column `addressId` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `cnaeId` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `registryTypeId` on the `professionals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address_id]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registry_type_id]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnae_id]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branch_activity_id]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_activity_id` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnae_id` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registry_type_id` to the `professionals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_cnaeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_registryTypeId_fkey";

-- DropIndex
DROP INDEX "public"."professionals_addressId_key";

-- DropIndex
DROP INDEX "public"."professionals_cnaeId_key";

-- DropIndex
DROP INDEX "public"."professionals_registryTypeId_key";

-- AlterTable
ALTER TABLE "public"."action_logs" ADD COLUMN     "branchActivityId" TEXT;

-- AlterTable
ALTER TABLE "public"."professionals" DROP COLUMN "addressId",
DROP COLUMN "cnaeId",
DROP COLUMN "registryTypeId",
ADD COLUMN     "address_id" TEXT NOT NULL,
ADD COLUMN     "branch_activity_id" TEXT NOT NULL,
ADD COLUMN     "cnae_id" TEXT NOT NULL,
ADD COLUMN     "registry_type_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "professionals_address_id_key" ON "public"."professionals"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_registry_type_id_key" ON "public"."professionals"("registry_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_cnae_id_key" ON "public"."professionals"("cnae_id");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_branch_activity_id_key" ON "public"."professionals"("branch_activity_id");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_registry_type_id_fkey" FOREIGN KEY ("registry_type_id") REFERENCES "public"."registry_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_cnae_id_fkey" FOREIGN KEY ("cnae_id") REFERENCES "public"."cnaes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_branch_activity_id_fkey" FOREIGN KEY ("branch_activity_id") REFERENCES "public"."branches_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_logs" ADD CONSTRAINT "action_logs_branchActivityId_fkey" FOREIGN KEY ("branchActivityId") REFERENCES "public"."branches_activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
