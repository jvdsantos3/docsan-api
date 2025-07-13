/*
  Warnings:

  - Made the column `birth_date` on table `professionals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `field_activity` on table `professionals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registry` on table `professionals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registry_uf` on table `professionals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnae` on table `professionals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "professionals" ALTER COLUMN "birth_date" SET NOT NULL,
ALTER COLUMN "field_activity" SET NOT NULL,
ALTER COLUMN "registry" SET NOT NULL,
ALTER COLUMN "registry_uf" SET NOT NULL,
ALTER COLUMN "cnae" SET NOT NULL;
