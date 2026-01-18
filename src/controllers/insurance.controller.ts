import type { Context } from "hono";
import { InsuranceService } from "../services/insurance.service";

export const getInsurances = async (c: Context) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const query = c.req.query('q');

    if (query) {
        const results = await InsuranceService.search(query, page, limit);
        return c.json(results);
    }

    const insurances = await InsuranceService.getAll(page, limit);
    return c.json(insurances);
};

export const getInsuranceById = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const insurance = await InsuranceService.findById(id);
    if (!insurance) return c.json({ error: "Insurance not found" }, 404);
    return c.json(insurance);
};

export const createInsurance = async (c: Context) => {
    const body = await c.req.json();
    if (!body.name) return c.json({ error: "Name is required" }, 400);
    try {
        const insurance = await InsuranceService.create(body);
        return c.json(insurance, 201);
    } catch (e: any) {
        if (e.code === 'P2002') {
            return c.json({ error: "Insurance company with this name already exists" }, 409);
        }
        return c.json({ error: "Creation failed" }, 400);
    }
};

export const updateInsurance = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = await c.req.json();
    try {
        const insurance = await InsuranceService.update(id, body);
        return c.json(insurance);
    } catch (e: any) {
        if (e.code === 'P2025') {
            return c.json({ error: "Insurance not found" }, 404);
        }
        return c.json({ error: "Update failed" }, 400);
    }
};

export const deleteInsurance = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    try {
        await InsuranceService.delete(id);
        return c.json({ success: true });
    } catch (e: any) {
        if (e.code === 'P2025') {
            return c.json({ error: "Insurance not found" }, 404);
        }
        return c.json({ error: "Delete failed" }, 400);
    }
};
