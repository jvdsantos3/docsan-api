/*
  Warnings:

  - You are about to drop the column `addressId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_addressId_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_ownerId_fkey";

-- DropIndex
DROP INDEX "companies_addressId_key";

-- DropIndex
DROP INDEX "companies_ownerId_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "addressId",
DROP COLUMN "ownerId",
ADD COLUMN     "address_id" TEXT NOT NULL,
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_address_id_key" ON "companies"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_owner_id_key" ON "companies"("owner_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
