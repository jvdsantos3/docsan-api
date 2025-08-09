/*
  Warnings:

  - You are about to drop the column `cnae` on the `professionals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnaeId]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnaeId` to the `professionals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."action_logs" ADD COLUMN     "cnaeId" TEXT;

-- AlterTable
ALTER TABLE "public"."professionals" DROP COLUMN "cnae",
ADD COLUMN     "cnaeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "professionals_cnaeId_key" ON "public"."professionals"("cnaeId");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_cnaeId_fkey" FOREIGN KEY ("cnaeId") REFERENCES "public"."cnaes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_logs" ADD CONSTRAINT "action_logs_cnaeId_fkey" FOREIGN KEY ("cnaeId") REFERENCES "public"."cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
