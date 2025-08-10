-- CreateEnum
CREATE TYPE "public"."ProfessionalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BANNED');

-- AlterTable
ALTER TABLE "public"."professionals" ADD COLUMN     "rejectedUntil" TIMESTAMP(3),
ADD COLUMN     "status" "public"."ProfessionalStatus" NOT NULL DEFAULT 'REJECTED';

-- CreateTable
CREATE TABLE "public"."ProfessionalStatusHistory" (
    "id" TEXT NOT NULL,
    "status" "public"."ProfessionalStatus" NOT NULL,
    "reason" TEXT,
    "rejectedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "professionalId" TEXT NOT NULL,
    "changedById" TEXT,

    CONSTRAINT "ProfessionalStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProfessionalStatusHistory" ADD CONSTRAINT "ProfessionalStatusHistory_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfessionalStatusHistory" ADD CONSTRAINT "ProfessionalStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
