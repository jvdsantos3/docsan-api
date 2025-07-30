/*
  Warnings:

  - Added the required column `prompt` to the `document_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "prompt" TEXT NOT NULL;
