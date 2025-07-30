/*
  Warnings:

  - Added the required column `validity_period` to the `document_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "validity_period" INTEGER NOT NULL;
