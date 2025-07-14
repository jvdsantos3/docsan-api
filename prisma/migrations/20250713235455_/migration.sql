/*
  Warnings:

  - You are about to drop the `company_professionals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_address_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "company_professionals" DROP CONSTRAINT "company_professionals_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company_professionals" DROP CONSTRAINT "company_professionals_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "document_types" DROP CONSTRAINT "document_types_company_id_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_company_id_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "indexations" DROP CONSTRAINT "indexations_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_company_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_company_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "professionals" DROP CONSTRAINT "professionals_addressId_fkey";

-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "professional_id" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "professional_id" TEXT;

-- AlterTable
ALTER TABLE "indexations" ADD COLUMN     "professional_id" TEXT;

-- DropTable
DROP TABLE "company_professionals";

-- DropTable
DROP TABLE "invitations";

-- DropTable
DROP TABLE "permissions";

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "PermissionType";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexations" ADD CONSTRAINT "indexations_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexations" ADD CONSTRAINT "indexations_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
