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