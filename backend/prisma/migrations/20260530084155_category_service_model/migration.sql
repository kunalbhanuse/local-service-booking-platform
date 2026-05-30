/*
  Warnings:

  - Made the column `businessName` on table `Provider` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'CLEANING', 'CARPENTRY', 'PAINTING');

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "businessName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "category",
ADD COLUMN     "category" "ServiceCategory" NOT NULL;
