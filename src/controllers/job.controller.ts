import type { Context } from "hono";
import { JobService } from "../services/job.service";

export const createJob = async (c: Context) => {
    const body = await c.req.json();
    try {
        const job = await JobService.createJob(body);
        return c.json(job, 201);
    } catch (e) {
        console.error(e);
        return c.json({ error: "Failed to create job", details: String(e) }, 400);
    }
};

export const getJobs = async (c: Context) => {
    const page = Number(c.req.query("page") || "1");
    const limit = Number(c.req.query("limit") || "10");

    // Extract all filter parameters
    const filters = {
        status: c.req.query("status"),
        search: c.req.query("search"), // General search
        vehicleRegistration: c.req.query("vehicleRegistration") || c.req.query("registration"),
        customerName: c.req.query("customerName") || c.req.query("customer"),
        chassisNumber: c.req.query("chassisNumber") || c.req.query("chassis"),
        vinNumber: c.req.query("vinNumber") || c.req.query("vin"),
        jobNumber: c.req.query("jobNumber"),
        insuranceCompanyId: c.req.query("insuranceCompanyId") ? Number(c.req.query("insuranceCompanyId")) : undefined,
        startDateFrom: c.req.query("startDateFrom"),
        startDateTo: c.req.query("startDateTo"),
        sortBy: c.req.query("sortBy"),
        sortOrder: (c.req.query("sortOrder") || "desc") as "asc" | "desc"
    };

    // Remove undefined values
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    );

    const result = await JobService.getAll(page, limit, Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined);
    return c.json(result);
};

export const getJobDetails = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) { return c.json({ error: "Invalid ID" }, 400); }
    const job = await JobService.getJobDetails(id);
    if (!job) { return c.json({ error: "Job not found" }, 404); }
    return c.json(job);
};

export const updateStepStatus = async (c: Context) => {
    const stepId = Number(c.req.param("stepId"));
    if (isNaN(stepId)) { return c.json({ error: "Invalid step ID" }, 400); }

    const body = await c.req.json();
    const validStatuses = ["pending", "in_progress", "completed", "skipped"];
    if (!body.status || !validStatuses.includes(body.status)) {
        return c.json({ error: "Invalid status. Must be: pending, in_progress, completed, skipped" }, 400);
    }

    // Parse employeeId if provided
    const employeeId = body.employeeId ? Number(body.employeeId) : undefined;
    if (body.employeeId && isNaN(employeeId!)) {
        return c.json({ error: "Invalid employee ID" }, 400);
    }

    try {
        const step = await JobService.updateStepStatus(stepId, body.status, employeeId);
        return c.json(step);
    } catch (e) {
        console.error(e);
        return c.json({ error: "Failed to update step", details: String(e) }, 400);
    }
};
