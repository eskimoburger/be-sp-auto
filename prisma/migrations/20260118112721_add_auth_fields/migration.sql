DROP VIEW IF EXISTS v_job_details;

/*
  Warnings:

  - Added the required column `password` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_employees" ("created_at", "id", "is_active", "name", "phone", "role", "updated_at") SELECT "created_at", "id", "is_active", "name", "phone", "role", "updated_at" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

CREATE VIEW IF NOT EXISTS v_job_details AS
SELECT
    j.id,
    j.job_number,
    v.registration,
    v.vin_number,
    v.brand,
    v.model,
    v.color,
    v.type AS vehicle_type,
    v.year AS vehicle_year,
    c.name AS customer_name,
    c.phone AS customer_phone,
    c.address AS customer_address,
    e.name AS receiver_name,
    ic.name AS insurance_company_name,
    j.payment_type,
    j.excess_fee,
    j.start_date,
    j.estimated_end_date,
    j.actual_end_date,
    j.repair_description,
    j.notes,
    j.current_stage_index,
    s.name AS current_stage_name,
    j.is_finished,
    j.created_at,
    j.updated_at
FROM jobs j
LEFT JOIN vehicles v ON j.vehicle_id = v.id
LEFT JOIN customers c ON j.customer_id = c.id
LEFT JOIN employees e ON j.receiver_id = e.id
LEFT JOIN insurance_companies ic ON j.insurance_company_id = ic.id
LEFT JOIN stages s ON j.current_stage_index + 1 = s.order_index;
