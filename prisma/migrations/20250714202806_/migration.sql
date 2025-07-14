/*
  Warnings:

  - You are about to drop the column `owner_id` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `owners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_owner_id_fkey";

-- DropIndex
DROP INDEX "companies_owner_id_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "owner_id";

-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "company_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "owners_company_id_key" ON "owners"("company_id");

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
