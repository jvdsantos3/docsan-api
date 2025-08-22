-- AlterTable
ALTER TABLE "public"."action_logs" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."action_logs" ADD CONSTRAINT "action_logs_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
