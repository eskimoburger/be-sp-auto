import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Job List API", () => {
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();

        // Ensure at least one job exists
        const custRes = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "Job Test Cust", phone: "1111" })
        });
        const cust = (await custRes.json()) as any;

        const vehRes = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ registration: "JOB-LIST-1", brand: "Toyota", customerId: cust.id })
        });
        const veh = (await vehRes.json()) as any;

        await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ vehicleId: veh.id, customerId: cust.id, jobNumber: "LIST-TEST-JOB" })
        });
    });

    it("should get all jobs", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = (await res.json()) as any;
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0].vehicle).toBeDefined();

        // Test pagination params
        const page2Res = await app.request("/api/v1/private/jobs?page=2&limit=1", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(page2Res.status).toBe(200);
    });
});
