/*
  Warnings:

  - You are about to drop the column `email` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `professionals` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "owners_email_key";

-- DropIndex
DROP INDEX "professionals_email_key";

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "email",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "email",
DROP COLUMN "password";
