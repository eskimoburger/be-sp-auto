/*
  Warnings:

  - A unique constraint covering the columns `[engine_number]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN "chassis_number" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "engine_number" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_address" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_district" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_postal_code" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_province" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_province_code" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "owner_sub_district" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "registration_date" DATETIME;
ALTER TABLE "vehicles" ADD COLUMN "registration_province" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "registration_province_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_engine_number_key" ON "vehicles"("engine_number");

-- CreateIndex
CREATE INDEX "vehicles_engine_number_idx" ON "vehicles"("engine_number");
