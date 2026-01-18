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
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.data).toBeDefined();
        expect(Array.isArray(body.data)).toBe(true);
    });

    it("should create a new employee", async () => {
        const newEmployee = { name: "Test Employee", role: "Tester", phone: "1234567890" };
        const res = await app.request("/api/v1/private/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newEmployee),
        });

        expect(res.status).toBe(201);
        const body = await res.json() as any;
        expect(body).toHaveProperty("id");
        expect(body.name).toBe(newEmployee.name);
    });
});
