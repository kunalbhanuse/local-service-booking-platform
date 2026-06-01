/*
  Warnings:

  - A unique constraint covering the columns `[providerId,name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_providerId_name_key" ON "Service"("providerId", "name");
