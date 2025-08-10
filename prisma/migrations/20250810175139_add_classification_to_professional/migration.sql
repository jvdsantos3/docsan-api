/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PersonClassification" AS ENUM ('PERSON', 'COMPANY');

-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_cnae_id_fkey";

-- AlterTable
ALTER TABLE "public"."professionals" ADD COLUMN     "classification" "public"."PersonClassification" NOT NULL DEFAULT 'PERSON',
ADD COLUMN     "cnpj" TEXT,
ALTER COLUMN "cnae_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "professionals_cnpj_key" ON "public"."professionals"("cnpj");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_cnae_id_fkey" FOREIGN KEY ("cnae_id") REFERENCES "public"."cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
