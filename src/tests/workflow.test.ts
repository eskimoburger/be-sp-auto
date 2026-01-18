import { describe, expect, it, beforeAll } from "bun:test";
import app from "../index";
import { getAuthToken } from "./test_helper";

describe("Workflow Integration", () => {
    let customerId: number;
    let vehicleId: number;
    let jobId: number;
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should create a customer", async () => {
        const res = await app.request("/api/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: "John Doe", phone: "0812345678" })
        });
        expect(res.status).toBe(201);
        const body = await res.json() as any;
        customerId = body.id;
        expect(body.id).toBeDefined();
    });

    it("should create a vehicle linked to customer", async () => {
        const res = await app.request("/api/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                registration: `1กข-${Date.now()}`,
                brand: "Toyota",
                model: "Vios",
                customerId: customerId
            })
        });
        expect(res.status).toBe(201);
        const body = await res.json() as any;
        vehicleId = body.id;
        expect(body.id).toBeDefined();
    });

    it("should create a job and initialize workflow", async () => {
        const res = await app.request("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                jobNumber: `JOB-${Date.now()}`,
                vehicleId: vehicleId,
                customerId: customerId,
                startDate: new Date().toISOString()
            })
        });

        if (res.status !== 201) {
            const err = await res.text();
            console.error("Create Job Error:", err);
        }
        expect(res.status).toBe(201);
        const body = await res.json() as any;
        jobId = body.id;
        expect(body.id).toBeDefined();
    });

    it("should retrieve full job details with stages", async () => {
        const res = await app.request(`/api/jobs/${jobId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;

        expect(body.jobNumber).toMatch(/JOB-\d+/);
        expect(body.jobStages).toHaveLength(3); // Claim, Repair, Billing

        // Claim Stage (Index 0) should be unlocked
        expect(body.jobStages[0].isLocked).toBe(false);
        // Repair Stage (Index 1) should be locked
        expect(body.jobStages[1].isLocked).toBe(true);

        // Check steps in Claim stage
        expect(body.jobStages[0].jobSteps.length).toBeGreaterThan(0);
        expect(body.jobStages[0].jobSteps[0].status).toBe("pending");
    });

    it("should return 400 when creating job fails", async () => {
        // Send invalid payload (missing vehicle ID) to trigger error
        const res = await app.request("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                jobNumber: "FAIL-JOB"
                // Missing vehicleId
            })
        });
        expect(res.status).toBe(400);

        const body = await res.json() as any;
        expect(body.error).toBeDefined();
    });
});
