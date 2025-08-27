-- DropForeignKey
ALTER TABLE "public"."registry_types" DROP CONSTRAINT "registry_types_branchActivityId_fkey";

-- AddForeignKey
ALTER TABLE "public"."registry_types" ADD CONSTRAINT "registry_types_branchActivityId_fkey" FOREIGN KEY ("branchActivityId") REFERENCES "public"."branches_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
