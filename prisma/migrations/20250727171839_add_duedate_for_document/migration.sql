/*
  Warnings:

  - Added the required column `duedate` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "duedate" TIMESTAMP(3) NOT NULL;
