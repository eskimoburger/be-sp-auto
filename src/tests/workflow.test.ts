import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
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
        const res = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: "John Doe", phone: "0812345678" })
        }, process.env);
        expect(res.status).toBe(201);
        const body = await res.json() as { id: number };
        customerId = body.id;
        expect(body.id).toBeDefined();
    });

    it("should create a vehicle linked to customer", async () => {
        const res = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                registration: `1กข-${Date.now()}`,
                brand: "Toyota",
                model: "Vios",
                customerId: customerId
            })
        }, process.env);
        expect(res.status).toBe(201);
        const body = await res.json() as { id: number };
        vehicleId = body.id;
        expect(body.id).toBeDefined();
    });

    it("should create a job and initialize workflow", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                jobNumber: `JOB-${Date.now()}`,
                vehicleId: vehicleId,
                customerId: customerId,
                startDate: new Date().toISOString()
            })
        }, process.env);

        if (res.status !== 201) {
            const err = await res.text();
            console.error("Create Job Error:", err);
        }
        expect(res.status).toBe(201);
        const body = await res.json() as { id: number };
        jobId = body.id;
        expect(body.id).toBeDefined();
    }, 20000);

    it("should retrieve full job details with stages", async () => {
        const res = await app.request(`/api/v1/private/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { jobNumber: string; jobStages: { isLocked: boolean; jobSteps: { status: string }[] }[] };

        expect(body.jobNumber).toMatch(/JOB-\d+/);
        expect(body.jobStages).toHaveLength(3); // Claim, Repair, Billing

        // Claim Stage (Index 0) should be unlocked
        expect(body.jobStages[0]?.isLocked).toBe(false);
        // Repair Stage (Index 1) should be locked
        expect(body.jobStages[1]?.isLocked).toBe(true);

        // Check steps in Claim stage
        expect(body.jobStages[0]?.jobSteps.length).toBeGreaterThan(0);
        expect(body.jobStages[0]?.jobSteps[0]?.status).toBe("pending");
    });

    it("should return 400 when creating job fails", async () => {
        // Send invalid payload (missing vehicle ID) to trigger error
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                jobNumber: "FAIL-JOB"
                // Missing vehicleId
            })
        }, process.env);
        expect(res.status).toBe(400);

        const body = await res.json() as { error?: string };
        expect(body.error).toBeDefined();
    });

    it("should have correct isSkippable values for step templates", async () => {
        // Get job details to check step templates
        const res = await app.request(`/api/v1/private/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { jobStages: { stage?: { code?: string }; stageId?: number; jobSteps: { stepTemplate?: { name?: string; isSkippable?: boolean } }[] }[] };

        // Find the REPAIR stage (should be index 1)
        const repairStage = body.jobStages.find(
            (s) => s.stage?.code === "repair" || s.stageId === 2
        );
        expect(repairStage).toBeDefined();

        // Check step templates have correct skippability
        // QC and ลูกค้ารับรถ should be isSkippable: false
        // Other REPAIR steps should be isSkippable: true
        for (const step of repairStage!.jobSteps) {
            const templateName = step.stepTemplate?.name || "";
            if (templateName === "QC" || templateName === "ลูกค้ารับรถ") {
                expect(step.stepTemplate?.isSkippable).toBe(false);
            } else if (templateName) {
                // Other REPAIR steps should be skippable
                expect(step.stepTemplate?.isSkippable).toBe(true);
            }
        }
    });

    it("should have all CLAIM steps as non-skippable", async () => {
        const res = await app.request(`/api/v1/private/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { jobStages: { stage?: { code?: string }; stageId?: number; jobSteps: { stepTemplate?: { isSkippable?: boolean } }[] }[] };

        // Find the CLAIM stage (should be index 0)
        const claimStage = body.jobStages.find(
            (s) => s.stage?.code === "claim" || s.stageId === 1
        );
        expect(claimStage).toBeDefined();

        // All CLAIM steps should be non-skippable
        for (const step of claimStage!.jobSteps) {
            if (step.stepTemplate) {
                expect(step.stepTemplate.isSkippable).toBe(false);
            }
        }
    });

    it("should have all BILLING steps as non-skippable", async () => {
        const res = await app.request(`/api/v1/private/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { jobStages: { stage?: { code?: string }; stageId?: number; jobSteps: { stepTemplate?: { isSkippable?: boolean } }[] }[] };

        // Find the BILLING stage (should be index 2)
        const billingStage = body.jobStages.find(
            (s) => s.stage?.code === "billing" || s.stageId === 3
        );
        expect(billingStage).toBeDefined();

        // All BILLING steps should be non-skippable
        for (const step of billingStage!.jobSteps) {
            if (step.stepTemplate) {
                expect(step.stepTemplate.isSkippable).toBe(false);
            }
        }
    });
});
