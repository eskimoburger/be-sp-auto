import type { Context } from "hono";
import { EmployeeService } from "../services/employee.service";

export const getEmployees = async (c: Context) => {
    const employees = await EmployeeService.getAll();
    return c.json(employees);
};

export const createEmployee = async (c: Context) => {
    const body = await c.req.json();
    const employee = await EmployeeService.create(body);
    return c.json(employee, 201);
};

export const deleteEmployee = async (c: Context) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
    try {
        await EmployeeService.delete(id);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ error: "Delete failed" }, 400);
    }
}
