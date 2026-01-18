import type { Context } from "hono";
import { VehicleService } from "../services/vehicle.service";

export const getVehicles = async (c: Context) => {
    const reg = c.req.query('reg');
    if (reg) {
        const vehicle = await VehicleService.findByRegistration(reg);
        return vehicle ? c.json([vehicle]) : c.json([]);
    }
    const vehicles = await VehicleService.getAll();
    return c.json(vehicles);
};

export const createVehicle = async (c: Context) => {
    const body = await c.req.json();
    try {
        const vehicle = await VehicleService.create(body);
        return c.json(vehicle, 201);
    } catch (e) {
        return c.json({ error: "Creation failed (Duplicate registration?)" }, 400);
    }
};

export const updateVehicle = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = await c.req.json();
    try {
        const vehicle = await VehicleService.update(id, body);
        return c.json(vehicle);
    } catch (e) {
        return c.json({ error: "Update failed" }, 400);
    }
}

export const deleteVehicle = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    try {
        await VehicleService.delete(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed" }, 400);
    }
}
