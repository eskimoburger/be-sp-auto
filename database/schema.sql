-- ============================================================
-- SP Auto Service - Database Schema (Updated)
-- Generated: 2026-01-18
-- Database: MySQL 8.0+
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS sp_auto_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sp_auto_service;

-- ============================================================
-- 1. REFERENCE TABLES
-- ============================================================

-- Employees (Staff members)
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insurance Companies
CREATE TABLE insurance_companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Photo Types (ช่างรูป)
CREATE TABLE photo_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    order_index INT DEFAULT 0
) ENGINE=InnoDB;

-- ============================================================
-- 2. CORE ENTITY TABLES
-- ============================================================

-- Customers
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Vehicles (Cars)
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    registration VARCHAR(20) NOT NULL UNIQUE COMMENT 'ทะเบียนรถ',
    vin_number VARCHAR(50) UNIQUE COMMENT 'เลขถัง - Vehicle Identification Number',
    brand VARCHAR(50) NOT NULL COMMENT 'ยี่ห้อ',
    model VARCHAR(50) COMMENT 'รุ่น',
    type VARCHAR(30) COMMENT 'ประเภทรถ: รถยนต์, รถกระบะ, รถมอเตอร์ไซค์',
    year VARCHAR(4) COMMENT 'ปี',
    color VARCHAR(30) COMMENT 'สี',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_vehicles_registration ON vehicles(registration);
CREATE INDEX idx_vehicles_vin ON vehicles(vin_number);

-- ============================================================
-- 3. WORKFLOW TEMPLATE TABLES
-- ============================================================

-- Stages (Workflow phases)
CREATE TABLE stages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'claim, repair, billing',
    name VARCHAR(50) NOT NULL COMMENT 'เคลม, ซ่อม, ตั้งเบิก',
    order_index INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Step Templates (Tasks within each stage)
CREATE TABLE step_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stage_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_skippable BOOLEAN DEFAULT FALSE COMMENT 'repair steps can be skipped',
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. JOB TRACKING TABLES
-- ============================================================

-- Jobs (Main repair orders)
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_id INT NOT NULL,
    customer_id INT,
    receiver_id INT COMMENT 'พนักงานผู้รับรถ',
    insurance_company_id INT,
    payment_type ENUM('Insurance', 'Cash') NOT NULL DEFAULT 'Insurance' COMMENT 'ประเภทการชำระ',
    excess_fee DECIMAL(10, 2) DEFAULT 0 COMMENT 'ค่าความเสียหายส่วนแรก',
    start_date DATE NOT NULL COMMENT 'วันที่นำรถเข้าจอดซ่อม',
    estimated_end_date DATE COMMENT 'กำหนดซ่อมเสร็จ/นัดรับรถ',
    actual_end_date DATE COMMENT 'วันที่เสร็จจริง',
    repair_description TEXT COMMENT 'ความต้องการซ่อม',
    notes TEXT COMMENT 'หมายเหตุ',
    current_stage_index INT DEFAULT 0,
    is_finished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (insurance_company_id) REFERENCES insurance_companies(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_jobs_job_number ON jobs(job_number);
CREATE INDEX idx_jobs_start_date ON jobs(start_date);
CREATE INDEX idx_jobs_status ON jobs(is_finished, current_stage_index);

-- Job Photos (ช่างรูป - Photo tracking per job)
CREATE TABLE job_photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    photo_type_id INT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_type_id) REFERENCES photo_types(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_job_photo (job_id, photo_type_id)
) ENGINE=InnoDB;

-- Job Stages (Stage instances per job)
CREATE TABLE job_stages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    stage_id INT NOT NULL,
    is_locked BOOLEAN DEFAULT TRUE,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_job_stage (job_id, stage_id)
) ENGINE=InnoDB;

-- Job Steps (Step instances per job stage)
CREATE TABLE job_steps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_stage_id INT NOT NULL,
    step_template_id INT NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'skipped') DEFAULT 'pending',
    employee_id INT COMMENT 'พนักงานผู้ดำเนินการ',
    completed_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (job_stage_id) REFERENCES job_stages(id) ON DELETE CASCADE,
    FOREIGN KEY (step_template_id) REFERENCES step_templates(id) ON DELETE RESTRICT,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_job_steps_status ON job_steps(status);

-- ============================================================
-- 5. SEED DATA
-- ============================================================

-- Stages
INSERT INTO stages (code, name, order_index) VALUES
('claim', 'เคลม', 1),
('repair', 'ซ่อม', 2),
('billing', 'ตั้งเบิก', 3);

-- Photo Types (ช่างรูป)
INSERT INTO photo_types (code, name, order_index) VALUES
('before_repair', 'ก่อนซ่อม', 1),
('dent', 'เคาะ', 2),
('putty', 'โป้วสี', 3),
('primer', 'พ่นสีพื้น', 4),
('paint', 'พ่นสีจริง', 5),
('parts', 'เกี่ยวอะไหล่', 6),
('polish', 'ขัดสี', 7),
('completed', 'รถเสร็จ', 8);

-- Claim Steps (13 steps)
INSERT INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(1, 'ยื่นเคลม', 1, FALSE),
(1, 'เช็ครายการ', 2, FALSE),
(1, 'ขอราคา', 3, FALSE),
(1, 'เสนอราคา', 4, FALSE),
(1, 'ส่งประกัน', 5, FALSE),
(1, 'อนุมัติ', 6, FALSE),
(1, 'หาอะไหล่', 7, FALSE),
(1, 'สั่งอะไหล่', 8, FALSE),
(1, 'อะไหล่ครบ', 9, FALSE),
(1, 'นัดคิวเข้า', 10, FALSE),
(1, 'ลูกค้าเข้าจอด', 11, FALSE),
(1, 'เสนอเพิ่ม', 12, FALSE),
(1, 'รถเสร็จ', 13, FALSE);

-- Repair Steps (12 steps - all skippable)
INSERT INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(2, 'รื้อ/ถอด', 1, TRUE),
(2, 'เคาะ', 2, TRUE),
(2, 'เคาะ เบิกอะไหล่', 3, TRUE),
(2, 'โป้วสี', 4, TRUE),
(2, 'พ่นสีพื้น', 5, TRUE),
(2, 'พ่นสีจริง', 6, TRUE),
(2, 'ประกอบเบิกอะไหล่', 7, TRUE),
(2, 'ขัดสี', 8, TRUE),
(2, 'ล้างรถ', 9, TRUE),
(2, 'QC', 10, TRUE),
(2, 'ลูกค้ารับรถ', 11, TRUE);

-- Billing Steps (8 steps)
INSERT INTO step_templates (stage_id, name, order_index, is_skippable) VALUES
(3, 'รถเสร็จ', 1, FALSE),
(3, 'เรียงรูป', 2, FALSE),
(3, 'ส่งอนุมัติ', 3, FALSE),
(3, 'อนุมัติเสร็จ', 4, FALSE),
(3, 'ออกใบกำกับภาษี', 5, FALSE),
(3, 'เรียงเรื่อง', 6, FALSE),
(3, 'นำเรื่องตั้งเบิก', 7, FALSE),
(3, 'วันจ่ายเงิน', 8, FALSE);

-- Sample Insurance Companies
INSERT INTO insurance_companies (name) VALUES
('วิริยะประกันภัย'),
('ทิพยประกันภัย'),
('ธนชาตประกันภัย'),
('อาคเนย์ประกันภัย'),
('เมืองไทยประกันภัย'),
('สินมั่นคงประกันภัย'),
('ไทยศรีประกันภัย'),
('ชับบ์ซัมมิท ประกันภัย');

-- Sample Employees
INSERT INTO employees (name, role) VALUES
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
CREATE VIEW v_job_statistics AS
SELECT
    COUNT(*) AS total_jobs,
    SUM(CASE WHEN current_stage_index = 0 AND NOT is_finished THEN 1 ELSE 0 END) AS claim_stage,
    SUM(CASE WHEN current_stage_index = 1 AND NOT is_finished THEN 1 ELSE 0 END) AS repair_stage,
    SUM(CASE WHEN current_stage_index = 2 AND NOT is_finished THEN 1 ELSE 0 END) AS billing_stage,
    SUM(CASE WHEN is_finished THEN 1 ELSE 0 END) AS finished
FROM jobs;

-- Job Details View
CREATE VIEW v_job_details AS
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
CREATE VIEW v_job_progress AS
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
-- 7. STORED PROCEDURES
-- ============================================================

DELIMITER //

-- Create new job with all stages and steps
CREATE PROCEDURE sp_create_job(
    IN p_registration VARCHAR(20),
    IN p_vin_number VARCHAR(50),
    IN p_brand VARCHAR(50),
    IN p_model VARCHAR(50),
    IN p_type VARCHAR(30),
    IN p_year VARCHAR(4),
    IN p_color VARCHAR(30),
    IN p_customer_name VARCHAR(100),
    IN p_customer_phone VARCHAR(20),
    IN p_customer_address TEXT,
    IN p_receiver_id INT,
    IN p_payment_type VARCHAR(10),
    IN p_insurance_company_id INT,
    IN p_excess_fee DECIMAL(10, 2),
    IN p_start_date DATE,
    IN p_estimated_end_date DATE,
    IN p_repair_description TEXT,
    IN p_notes TEXT
)
BEGIN
    DECLARE v_customer_id INT;
    DECLARE v_vehicle_id INT;
    DECLARE v_job_id INT;
    DECLARE v_job_number VARCHAR(20);
    DECLARE v_stage_id INT;
    DECLARE v_job_stage_id INT;
    DECLARE v_is_first BOOLEAN DEFAULT TRUE;
    DECLARE v_done BOOLEAN DEFAULT FALSE;
    
    DECLARE stage_cursor CURSOR FOR SELECT id FROM stages ORDER BY order_index;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- Start transaction
    START TRANSACTION;

    -- 1. Create customer
    INSERT INTO customers (name, phone, address)
    VALUES (p_customer_name, p_customer_phone, p_customer_address);
    SET v_customer_id = LAST_INSERT_ID();

    -- 2. Create vehicle
    INSERT INTO vehicles (customer_id, registration, vin_number, brand, model, type, year, color)
    VALUES (v_customer_id, p_registration, p_vin_number, p_brand, p_model, p_type, p_year, p_color);
    SET v_vehicle_id = LAST_INSERT_ID();

    -- 3. Generate job number
    SELECT CONCAT('JOB-', LPAD(COALESCE(MAX(CAST(SUBSTRING(job_number, 5) AS UNSIGNED)), 0) + 1, 4, '0'))
    INTO v_job_number FROM jobs;

    -- 4. Create job
    INSERT INTO jobs (
        job_number, vehicle_id, customer_id, receiver_id,
        insurance_company_id, payment_type, excess_fee,
        start_date, estimated_end_date, repair_description, notes,
        current_stage_index
    ) VALUES (
        v_job_number, v_vehicle_id, v_customer_id, p_receiver_id,
        CASE WHEN p_payment_type = 'Insurance' THEN p_insurance_company_id ELSE NULL END,
        p_payment_type, p_excess_fee,
        p_start_date, p_estimated_end_date, p_repair_description, p_notes, 0
    );
    SET v_job_id = LAST_INSERT_ID();

    -- 5. Create job_photos for all photo types
    INSERT INTO job_photos (job_id, photo_type_id, is_required, is_completed)
    SELECT v_job_id, id, FALSE, FALSE FROM photo_types ORDER BY order_index;

    -- 6. Create job_stages and job_steps
    OPEN stage_cursor;
    
    stage_loop: LOOP
        FETCH stage_cursor INTO v_stage_id;
        IF v_done THEN
            LEAVE stage_loop;
        END IF;

        INSERT INTO job_stages (job_id, stage_id, is_locked, is_completed)
        VALUES (v_job_id, v_stage_id, NOT v_is_first, FALSE);
        SET v_job_stage_id = LAST_INSERT_ID();

        -- Create steps for this stage
        INSERT INTO job_steps (job_stage_id, step_template_id, status)
        SELECT v_job_stage_id, id, 'pending'
        FROM step_templates
        WHERE stage_id = v_stage_id
        ORDER BY order_index;

        SET v_is_first = FALSE;
    END LOOP;
    
    CLOSE stage_cursor;

    COMMIT;

    -- Return the new job
    SELECT v_job_id AS job_id, v_job_number AS job_number;
END //

-- Update step status
CREATE PROCEDURE sp_update_step(
    IN p_job_step_id INT,
    IN p_status VARCHAR(20),
    IN p_employee_id INT
)
BEGIN
    UPDATE job_steps 
    SET 
        status = p_status,
        employee_id = p_employee_id,
        completed_at = CASE WHEN p_status IN ('completed', 'skipped') THEN NOW() ELSE NULL END
    WHERE id = p_job_step_id;
END //

-- Complete stage and unlock next
CREATE PROCEDURE sp_complete_stage(
    IN p_job_id INT,
    IN p_stage_index INT
)
BEGIN
    -- Mark current stage as completed
    UPDATE job_stages js
    JOIN stages s ON js.stage_id = s.id
    SET js.is_completed = TRUE, js.completed_at = NOW()
    WHERE js.job_id = p_job_id AND s.order_index = p_stage_index + 1;
    
    -- Unlock next stage
    UPDATE job_stages js
    JOIN stages s ON js.stage_id = s.id
    SET js.is_locked = FALSE, js.started_at = NOW()
    WHERE js.job_id = p_job_id AND s.order_index = p_stage_index + 2;
    
    -- Update job's current stage index
    UPDATE jobs 
    SET 
        current_stage_index = p_stage_index + 1,
        is_finished = (p_stage_index = 2),
        actual_end_date = CASE WHEN p_stage_index = 2 THEN CURDATE() ELSE NULL END
    WHERE id = p_job_id;
END //

DELIMITER ;

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
