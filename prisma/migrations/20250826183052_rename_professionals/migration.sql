/*
  Warnings:

  - Added the required column `branchActivityId` to the `registry_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."registry_types" ADD COLUMN     "branchActivityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."registry_types" ADD CONSTRAINT "registry_types_branchActivityId_fkey" FOREIGN KEY ("branchActivityId") REFERENCES "public"."branches_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
