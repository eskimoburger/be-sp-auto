import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Delete Operations", () => {
    let empId: number;
    let custId: number;
    let vehId: number;
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    // 1. Employee Delete
    it("should create and delete an employee", async () => {
        // Create
        const createRes = await app.request("/api/v1/private/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: "Delete Me", role: "staff" })
        });
        const body = (await createRes.json()) as any;
        empId = body.id;
        expect(createRes.status).toBe(201);

        // Delete
        const delRes = await app.request(`/api/v1/private/employees/${empId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(delRes.status).toBe(200);

        // Verify gone (impl detail: findMany might verify it's gone from list?)
        // Since we don't have getById for employee, we trust delete status or check list if implemented fully
    });

    // 2. Customer Delete
    it("should create and delete a customer", async () => {
        const createRes = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: "Temp Customer", phone: "0000" })
        });
        const body = (await createRes.json()) as any;
        custId = body.id;

        const delRes = await app.request(`/api/v1/private/customers/${custId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(delRes.status).toBe(200);

        // Check 404
        const check = await app.request(`/api/v1/private/customers/${custId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(check.status).toBe(404);
    });

    // 3. Vehicle Delete
    it("should create and delete a vehicle", async () => {
        const createRes = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ registration: `DEL-${Date.now()}`, brand: "Test" })
        });
        const body = (await createRes.json()) as any;
        vehId = body.id;

        const delRes = await app.request(`/api/v1/private/vehicles/${vehId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(delRes.status).toBe(200);

        // Use registration search to confirm gone? Or implement getById for vehicle if exists
        // Vehicle controller only has get all and search, we can use search
        // Wait... getVehicles returns all.
    });

    it("should fail to delete non-existent ID", async () => {
        const res = await app.request("/api/v1/private/customers/999999", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(400); // Because Prisma throws if record not found in delete, and catch block returns 400
    });
});
