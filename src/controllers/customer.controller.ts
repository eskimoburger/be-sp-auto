import type { Context } from "hono";
import { CustomerService } from "../services/customer.service";

export const getCustomers = async (c: Context) => {
    const query = c.req.query('q');
    if (query) {
        const results = await CustomerService.search(query);
        return c.json(results); // Search remains non-paginated for now per existing method signature, or we update it later if needed.
    }
    const page = Number(c.req.query('page') || '1');
    const limit = Number(c.req.query('limit') || '10');
    const result = await CustomerService.getAll(page, limit);
    return c.json(result);
};

export const getCustomerById = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const customer = await CustomerService.findById(id);
    if (!customer) return c.json({ error: "Customer not found" }, 404);
    return c.json(customer);
}

export const createCustomer = async (c: Context) => {
    const body = await c.req.json();
    const customer = await CustomerService.create(body);
    return c.json(customer, 201);
};

export const updateCustomer = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = await c.req.json();
    try {
        const customer = await CustomerService.update(id, body);
        return c.json(customer);
    } catch (e) {
        return c.json({ error: "Update failed" }, 400);
    }
}

export const deleteCustomer = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    try {
        await CustomerService.delete(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed (May have related records)" }, 400);
    }
}
