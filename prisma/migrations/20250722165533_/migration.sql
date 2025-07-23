/*
  Warnings:

  - You are about to drop the column `userId` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `action_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "action_logs" DROP COLUMN "userId",
DROP COLUMN "userType";
