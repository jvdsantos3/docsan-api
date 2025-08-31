/*
  Warnings:

  - Added the required column `price` to the `professional_services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('PIX', 'BOLETO', 'DEBIT_CARD', 'CREDIT_CARD');

-- AlterTable
ALTER TABLE "public"."professional_services" ADD COLUMN     "max_installments" INTEGER,
ADD COLUMN     "paymentMethods" "public"."PaymentMethod"[],
ADD COLUMN     "price" INTEGER NOT NULL;
