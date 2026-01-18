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
    const page = Number(c.req.query('page') || '1');
    const limit = Number(c.req.query('limit') || '10');
    const status = c.req.query('status');
    const result = await JobService.getAll(page, limit, status);
    return c.json(result);
};

export const getJobDetails = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const job = await JobService.getJobDetails(id);
    if (!job) return c.json({ error: "Job not found" }, 404);
    return c.json(job);
};
