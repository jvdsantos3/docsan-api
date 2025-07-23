/*
  Warnings:

  - You are about to drop the column `resourceId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `action_logs` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `action_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_company_id_fkey";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "document_action_logs";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "document_type_action_logs";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "owner_action_logs";

-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "professional_action_logs";

-- AlterTable
ALTER TABLE "action_logs" DROP COLUMN "resourceId",
DROP COLUMN "resourceType",
ADD COLUMN     "company_type_id" TEXT,
ADD COLUMN     "document_id" TEXT,
ADD COLUMN     "owner_id" TEXT,
ADD COLUMN     "professional_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_company_type_id_fkey" FOREIGN KEY ("company_type_id") REFERENCES "document_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
