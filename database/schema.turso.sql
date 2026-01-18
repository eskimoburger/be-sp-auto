-- ============================================================
-- SP Auto Service - Database Schema for Turso (SQLite/libSQL)
-- Generated: 2026-01-18
-- ============================================================

-- ============================================================
-- 1. REFERENCE TABLES
-- ============================================================

-- Employees (Staff members)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Insurance Companies
CREATE TABLE IF NOT EXISTS insurance_companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Photo Types (ช่างรูป)
CREATE TABLE IF NOT EXISTS photo_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- ============================================================
-- 2. CORE ENTITY TABLES
-- ============================================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Vehicles (Cars)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    registration TEXT NOT NULL UNIQUE, -- ทะเบียนรถ
    vin_number TEXT UNIQUE, -- เลขถัง
    brand TEXT NOT NULL, -- ยี่ห้อ
    model TEXT, -- รุ่น
    type TEXT, -- ประเภทรถ
    year TEXT, -- ปี
    color TEXT, -- สี
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin_number);

-- ============================================================
-- 3. WORKFLOW TEMPLATE TABLES
-- ============================================================

-- Stages (Workflow phases)
CREATE TABLE IF NOT EXISTS stages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE, -- claim, repair, billing
    name TEXT NOT NULL, -- เคลม, ซ่อม, ตั้งเบิก
    order_index INTEGER NOT NULL DEFAULT 0
);

-- Step Templates (Tasks within each stage)
CREATE TABLE IF NOT EXISTS step_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stage_id INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_skippable INTEGER DEFAULT 0
);

-- ============================================================
-- 4. JOB TRACKING TABLES
-- ============================================================

-- Jobs (Main repair orders)
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_number TEXT NOT NULL UNIQUE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    receiver_id INTEGER REFERENCES employees(id) ON DELETE SET NULL, -- เจ้าหน้าที่รับรถ
    insurance_company_id INTEGER REFERENCES insurance_companies(id) ON DELETE SET NULL,
    payment_type TEXT NOT NULL DEFAULT 'Insurance' CHECK (payment_type IN ('Insurance', 'Cash')),
    excess_fee REAL DEFAULT 0, -- ค่าความเสียหายส่วนแรก
    start_date TEXT NOT NULL, -- วันที่นำรถเข้าจอดซ่อม
    estimated_end_date TEXT, -- กำหนดซ่อมเสร็จ/นัดรับรถ
    actual_end_date TEXT, -- วันที่เสร็จจริง
    repair_description TEXT, -- ความต้องการซ่อม
    notes TEXT, -- หมายเหตุ
    current_stage_index INTEGER DEFAULT 0,
    is_finished INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON jobs(job_number);
CREATE INDEX IF NOT EXISTS idx_jobs_start_date ON jobs(start_date);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(is_finished, current_stage_index);

-- Job Photos (ช่างรูป - Photo tracking per job)
CREATE TABLE IF NOT EXISTS job_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    photo_type_id INTEGER NOT NULL REFERENCES photo_types(id) ON DELETE RESTRICT,
    is_required INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    completed_at TEXT,
    UNIQUE(job_id, photo_type_id)
);

-- Job Stages (Stage instances per job)
CREATE TABLE IF NOT EXISTS job_stages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    stage_id INTEGER NOT NULL REFERENCES stages(id) ON DELETE RESTRICT,
    is_locked INTEGER DEFAULT 1,
    is_completed INTEGER DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    UNIQUE(job_id, stage_id)
);

-- Job Steps (Step instances per job stage)
CREATE TABLE IF NOT EXISTS job_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_stage_id INTEGER NOT NULL REFERENCES job_stages(id) ON DELETE CASCADE,
    step_template_id INTEGER NOT NULL REFERENCES step_templates(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'skipped')),
    employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL, -- เจ้าหน้าที่
    completed_at TEXT, -- วันที่/เวลา
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_steps_status ON job_steps(status);

-- ============================================================
-- 5. SEED DATA
-- ============================================================

-- Stages
INSERT OR IGNORE INTO stages (code, name, order_index) VALUES
('claim', 'เคลม', 1),
('repair', 'ซ่อม', 2),
('billing', 'ตั้งเบิก', 3);

-- Photo Types (ช่างรูป)
INSERT OR IGNORE INTO photo_types (code, name, order_index) VALUES
('before_repair', 'ก่อนซ่อม', 1),
('dent', 'เคาะ', 2),
('putty', 'โป้วสี', 3),
('primer', 'พ่นสีพื้น', 4),
('paint', 'พ่นสีจริง', 5),
('parts', 'เกี่ยวอะไหล่', 6),
('polish', 'ขัดสี', 7),
('completed', 'รถเสร็จ', 8);

-- Claim Steps (13 steps)
INSERT OR IGNORE INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(1, 'ยื่นเคลม', 1, 0),
(1, 'เช็ครายการ', 2, 0),
(1, 'ขอราคา', 3, 0),
(1, 'เสนอราคา', 4, 0),
(1, 'ส่งประกัน', 5, 0),
(1, 'อนุมัติ', 6, 0),
(1, 'หาอะไหล่', 7, 0),
(1, 'สั่งอะไหล่', 8, 0),
(1, 'อะไหล่ครบ', 9, 0),
(1, 'นัดคิวเข้า', 10, 0),
(1, 'ลูกค้าเข้าจอด', 11, 0),
(1, 'เสนอเพิ่ม', 12, 0),
(1, 'รถเสร็จ', 13, 0);

-- Repair Steps (11 steps - all skippable)
INSERT OR IGNORE INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(2, 'รื้อ/ถอด', 1, 1),
(2, 'เคาะ', 2, 1),
(2, 'เคาะ เบิกอะไหล่', 3, 1),
(2, 'โป้วสี', 4, 1),
(2, 'พ่นสีพื้น', 5, 1),
(2, 'พ่นสีจริง', 6, 1),
(2, 'ประกอบเบิกอะไหล่', 7, 1),
(2, 'ขัดสี', 8, 1),
(2, 'ล้างรถ', 9, 1),
(2, 'QC', 10, 1),
(2, 'ลูกค้ารับรถ', 11, 1);

-- Billing Steps (8 steps)
INSERT OR IGNORE INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(3, 'รถเสร็จ', 1, 0),
(3, 'เรียงรูป', 2, 0),
(3, 'ส่งอนุมัติ', 3, 0),
(3, 'อนุมัติเสร็จ', 4, 0),
(3, 'ออกใบกำกับภาษี', 5, 0),
(3, 'เรียงเรื่อง', 6, 0),
(3, 'นำเรื่องตั้งเบิก', 7, 0),
(3, 'วันจ่ายเงิน', 8, 0);

-- Sample Insurance Companies
INSERT OR IGNORE INTO insurance_companies (name) VALUES
('วิริยะประกันภัย'),
('ทิพยประกันภัย'),
('ธนชาตประกันภัย'),
('อาคเนย์ประกันภัย'),
('เมืองไทยประกันภัย'),
('สินมั่นคงประกันภัย'),
('ไทยศรีประกันภัย'),
('ชับบ์ซัมมิท ประกันภัย');

-- Sample Employees
INSERT OR IGNORE INTO employees (name, role) VALUES
('สมชาย มีสุข', 'receiver'),
('วิชัย เก่ง', 'receiver'),
('สุธี แก้ว', 'technician'),
('ประเสริฐ ทอง', 'technician'),
('กฤษณ์ เดชา', 'technician'),
('อนุชิต รักษ์', 'technician'),
('ธนา วิริยะ', 'admin'),
('พิชัย หาญ', 'admin');

-- ============================================================
-- 6. VIEWS
-- ============================================================

-- Dashboard Statistics
CREATE VIEW IF NOT EXISTS v_job_statistics AS
SELECT
    COUNT(*) AS total_jobs,
    SUM(CASE WHEN current_stage_index = 0 AND is_finished = 0 THEN 1 ELSE 0 END) AS claim_stage,
    SUM(CASE WHEN current_stage_index = 1 AND is_finished = 0 THEN 1 ELSE 0 END) AS repair_stage,
    SUM(CASE WHEN current_stage_index = 2 AND is_finished = 0 THEN 1 ELSE 0 END) AS billing_stage,
    SUM(CASE WHEN is_finished = 1 THEN 1 ELSE 0 END) AS finished
FROM jobs;

-- Job Details View
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

-- Job Steps Progress View
CREATE VIEW IF NOT EXISTS v_job_progress AS
SELECT
    j.id AS job_id,
    j.job_number,
    s.name AS stage_name,
    js.is_locked,
    js.is_completed AS stage_completed,
    COUNT(jst.id) AS total_steps,
    SUM(CASE WHEN jst.status = 'completed' THEN 1 ELSE 0 END) AS completed_steps,
    SUM(CASE WHEN jst.status = 'skipped' THEN 1 ELSE 0 END) AS skipped_steps,
    SUM(CASE WHEN jst.status = 'pending' THEN 1 ELSE 0 END) AS pending_steps
FROM jobs j
JOIN job_stages js ON j.id = js.job_id
JOIN stages s ON js.stage_id = s.id
LEFT JOIN job_steps jst ON js.id = jst.job_stage_id
GROUP BY j.id, j.job_number, s.name, js.is_locked, js.is_completed, s.order_index
ORDER BY j.id, s.order_index;

-- ============================================================
-- 7. TRIGGERS (for updated_at)
-- ============================================================

CREATE TRIGGER IF NOT EXISTS trg_employees_updated_at
AFTER UPDATE ON employees
BEGIN
    UPDATE employees SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_customers_updated_at
AFTER UPDATE ON customers
BEGIN
    UPDATE customers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_vehicles_updated_at
AFTER UPDATE ON vehicles
BEGIN
    UPDATE vehicles SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_jobs_updated_at
AFTER UPDATE ON jobs
BEGIN
    UPDATE jobs SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
