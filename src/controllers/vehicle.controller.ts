import type { Context } from "hono";
import { VehicleService } from "../services/vehicle.service";

export const getVehicles = async (c: Context) => {
    const reg = c.req.query("reg");
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
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    const body = await c.req.json();
    try {
        const vehicle = await VehicleService.update(id, body);
        return c.json(vehicle);
    } catch (e) {
        return c.json({ error: "Update failed" }, 400);
    }
};

export const deleteVehicle = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    try {
        await VehicleService.delete(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed" }, 400);
    }
};

export const getVehicleBrands = async (c: Context) => {
    const brands = await VehicleService.getBrands();
    return c.json(brands);
};

export const getVehicleBrandById = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    const brand = await VehicleService.getBrandById(id);
    if (!brand) {return c.json({ error: "Brand not found" }, 404);}
    return c.json(brand);
};

export const createVehicleBrand = async (c: Context) => {
    const body = await c.req.json();
    // Validate required fields
    if (!body.code || !body.name || !body.nameEn || !body.country) {
        return c.json({ error: "Missing required fields: code, name, nameEn, country" }, 400);
    }
    try {
        const brand = await VehicleService.createBrand(body);
        return c.json(brand, 201);
    } catch (e) {
        return c.json({ error: "Creation failed (Duplicate code?)" }, 400);
    }
};

export const updateVehicleBrand = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    const body = await c.req.json();
    try {
        const brand = await VehicleService.updateBrand(id, body);
        return c.json(brand);
    } catch (e) {
        return c.json({ error: "Update failed" }, 400);
    }
};

export const deleteVehicleBrand = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    try {
        await VehicleService.deleteBrand(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed (May have related models)" }, 400);
    }
};

// VehicleType CRUD
export const getVehicleTypes = async (c: Context) => {
    const types = await VehicleService.getTypes();
    return c.json(types);
};

export const getVehicleTypeById = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    const type = await VehicleService.getTypeById(id);
    if (!type) {return c.json({ error: "Type not found" }, 404);}
    return c.json(type);
};

export const createVehicleType = async (c: Context) => {
    const body = await c.req.json();
    // Validate required fields
    if (!body.code || !body.name || !body.nameEn) {
        return c.json({ error: "Missing required fields: code, name, nameEn" }, 400);
    }
    try {
        const type = await VehicleService.createType(body);
        return c.json(type, 201);
    } catch (e) {
        return c.json({ error: "Creation failed (Duplicate code?)" }, 400);
    }
};

export const updateVehicleType = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    const body = await c.req.json();
    try {
        const type = await VehicleService.updateType(id, body);
        return c.json(type);
    } catch (e) {
        return c.json({ error: "Update failed" }, 400);
    }
};

export const deleteVehicleType = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {return c.json({ error: "Invalid ID" }, 400);}
    try {
        await VehicleService.deleteType(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed (May have related models)" }, 400);
    }
};
