import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Job Creation API", () => {
    let token: string;
    let testCustomer: { id: number; name: string; phone: string };
    let testVehicle: { id: number; registration: string };

    beforeAll(async () => {
        token = await getAuthToken();

        // Create a test customer
        const custRes = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: `ทดสอบ สร้างงาน ${Date.now()}`, phone: "0899999999" })
        }, process.env);
        testCustomer = await custRes.json() as { id: number; name: string; phone: string };

        // Create a test vehicle
        const vehRes = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                registration: `ทดสอบ-CREATE-${Date.now()}`,
                brand: "TestBrand",
                model: "TestModel",
                customerId: testCustomer.id
            })
        }, process.env);
        testVehicle = await vehRes.json() as { id: number; registration: string };

        if (!testCustomer || !testCustomer.id) {
            console.error("FAILED TO CREATE CUSTOMER:", JSON.stringify(testCustomer));
            throw new Error("Failed to create test customer");
        }
        if (!testVehicle || !testVehicle.id) {
            console.error("FAILED TO CREATE VEHICLE:", JSON.stringify(testVehicle));
            throw new Error("Failed to create test vehicle");
        }

        console.log(`Test Setup Complete: CustomerID=${testCustomer.id}, VehicleID=${testVehicle.id}`);
    }, 30000);

    it("should auto-generate jobNumber when not provided", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; jobNumber: string };
        expect(job.id).toBeDefined();
        expect(job.jobNumber).toBeDefined();
        expect(job.jobNumber).toMatch(/^JOB-/); // Should start with JOB-
        expect(job.jobNumber.length).toBeGreaterThan(4); // JOB- + generated suffix
    }, 30000);

    it("should use provided jobNumber when specified", async () => {
        const customJobNumber = `JOB-CUSTOM-${Date.now()}`;
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customerId: testCustomer.id,
                jobNumber: customJobNumber,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; jobNumber: string };
        expect(job.jobNumber).toBe(customJobNumber);
    }, 30000);

    it("should create job with inline vehicle data", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    registration: `INLINE-${Date.now()}`,
                    brand: "InlineBrand"
                },
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; jobNumber: string; vehicleId: number };
        expect(job.jobNumber).toMatch(/^JOB-/);
        expect(job.vehicleId).toBeDefined();
    }, 30000);

    it("should create job with inline customer data", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customer: {
                    name: `ลูกค้าใหม่-${Date.now()}`,
                    phone: "0812345678"
                },
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; jobNumber: string; customerId: number };
        expect(job.jobNumber).toMatch(/^JOB-/);
        expect(job.customerId).toBeDefined();
    }, 30000);

    it("should fail when neither vehicleId nor vehicle is provided", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(400);
        const body = await res.json() as { error: string };
        expect(body.error).toBe("Failed to create job");
    }, 30000);

    // --- Extended Coverage ---

    it("should find and link existing vehicle by registration", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    registration: testVehicle.registration, // Existing Reg
                    brand: "ShouldIgnoreThisBrand"
                },
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; vehicleId: number };
        expect(job.vehicleId).toBe(testVehicle.id); // Should resolve to existing ID
    }, 30000);

    it("should fail if inline vehicle data is missing required fields", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    // Missing registration
                    brand: "Toyota"
                },
                customerId: testCustomer.id
            })
        }, process.env);

        expect(res.status).toBe(400);
    }, 30000);

    it("should find and link existing customer by name and phone", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customer: {
                    name: testCustomer.name, // Existing Name
                    phone: testCustomer.phone // Existing Phone
                },
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; customerId: number };
        expect(job.customerId).toBe(testCustomer.id); // Should resolve to existing ID
    }, 30000);

    it("should create workflow (stages, steps) and photos upon job creation", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number };

        // Verify side effects via get details
        const detailsRes = await app.request(`/api/v1/private/jobs/${job.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const details = await detailsRes.json() as { jobStages: any[]; jobPhotos: any[] };

        expect(details.jobStages.length).toBeGreaterThan(0); // Should have stages (Claim, Repair, Billing)
        expect(details.jobStages[0].jobSteps.length).toBeGreaterThan(0); // Should have steps
        expect(details.jobPhotos.length).toBeGreaterThan(0); // Should have photo requirements
    }, 30000);

    it("should save optional fields correctly", async () => {
        const notes = "Test Notes";
        const repairDescription = "Fix bumper";
        const estimatedEndDate = "2026-02-01T00:00:00.000Z";

        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z",
                notes,
                repairDescription,
                estimatedEndDate
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { notes: string; repairDescription: string; estimatedEndDate: string };
        expect(job.notes).toBe(notes);
        expect(job.repairDescription).toBe(repairDescription);
        expect(new Date(job.estimatedEndDate).toISOString()).toBe(estimatedEndDate);
    }, 30000);
    it("should ignore extraneous fields in payload", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle.id,
                customerId: testCustomer.id,
                startDate: "2026-01-21T00:00:00.000Z",
                // Extra fields that should be ignored
                registration: "IGNORE-ME",
                brand: "IGNORE-ME",
                someRandomField: 123
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number };
        expect(job.id).toBeDefined();
    }, 30000);
});
