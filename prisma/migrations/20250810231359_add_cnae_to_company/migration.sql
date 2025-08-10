/*
  Warnings:

  - You are about to drop the column `cnae` on the `companies` table. All the data in the column will be lost.
  - Added the required column `cnaeId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "cnae",
ADD COLUMN     "cnaeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_cnaeId_fkey" FOREIGN KEY ("cnaeId") REFERENCES "public"."cnaes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
