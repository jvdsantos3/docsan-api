/*
  Warnings:

  - Added the required column `full_name` to the `registry_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."registry_types" ADD COLUMN     "full_name" TEXT NOT NULL;
