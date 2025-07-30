/*
  Warnings:

  - The `metadata` column on the `document_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `userId` on table `action_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_userId_fkey";

-- AlterTable
ALTER TABLE "action_logs" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_types" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB[];

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
