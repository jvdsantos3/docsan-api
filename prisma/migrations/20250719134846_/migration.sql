-- DropForeignKey
ALTER TABLE "document_types" DROP CONSTRAINT "document_types_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "indexations" DROP CONSTRAINT "indexations_professional_id_fkey";
