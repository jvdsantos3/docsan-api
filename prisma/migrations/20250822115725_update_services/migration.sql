/*
  Warnings:

  - The primary key for the `professional_services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[professional_id,service_id]` on the table `professional_services` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `professional_services` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."professional_services" DROP CONSTRAINT "professional_services_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "professional_services_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "professional_services_professional_id_service_id_key" ON "public"."professional_services"("professional_id", "service_id");
