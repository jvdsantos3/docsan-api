-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_company_id_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_company_type_id_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_document_id_fkey";

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_company_type_id_fkey" FOREIGN KEY ("company_type_id") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
