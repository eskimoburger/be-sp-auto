import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Employee API", () => {
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should return empty list initially", async () => {
        const res = await app.request("/api/v1/private/employees", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: unknown[] };
        expect(body.data).toBeDefined();
        expect(Array.isArray(body.data)).toBe(true);
    });

    it("should create a new employee", async () => {
        const newEmployee = {
            name: "Test Employee",
            username: `test_emp_${Date.now()}`,
            password: "password123",
            role: "staff",
            phone: "1234567890"
        };
        const res = await app.request("/api/v1/private/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newEmployee)
        }, process.env);

        expect(res.status).toBe(201);
        const body = await res.json() as { id: number; name: string };
        expect(body).toHaveProperty("id");
        expect(body.name).toBe(newEmployee.name);
    });
    it("should filter employees by name query", async () => {
        const uniqueSuffix = Date.now();
        const employee = {
            name: `Searchable One ${uniqueSuffix}`,
            username: `search_1_${uniqueSuffix}`,
            password: "password123",
            role: "staff",
            phone: "1111111111"
        };

        await app.request("/api/v1/private/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(employee)
        });

        const res = await app.request(`/api/v1/private/employees?q=${encodeURIComponent(employee.name)}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);

        expect(res.status).toBe(200);
        const body = await res.json() as { data: any[] };
        expect(body.data.length).toBeGreaterThanOrEqual(1);
        const found = body.data.find((e: any) => e.name === employee.name);
        expect(found).toBeDefined();
    });

    it("should return correct pagination structure", async () => {
        const res = await app.request("/api/v1/private/employees?page=1&limit=1", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);

        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("total");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("limit");
        expect(body).toHaveProperty("totalPages");
        expect(body.limit).toBe(1);
    });
});
