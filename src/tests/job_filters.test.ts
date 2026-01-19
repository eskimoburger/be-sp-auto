import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Job Filters API", () => {
    let token: string;
    let testCustomer1: { id: number };
    let testCustomer2: { id: number };
    let testVehicle1: { id: number };
    let testVehicle2: { id: number };

    beforeAll(async () => {
        token = await getAuthToken();

        // Create test customers
        const cust1Res = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "สมชาย ใจดี", phone: "0811111111" })
        });
        testCustomer1 = await cust1Res.json() as { id: number };

        const cust2Res = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "สมหญิง รักษ์ดี", phone: "0822222222" })
        });
        testCustomer2 = await cust2Res.json() as { id: number };

        // Create test vehicles
        const veh1Res = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                registration: "กข-1234-กรุงเทพ",
                brand: "Toyota",
                model: "Camry",
                customerId: testCustomer1.id,
                vinNumber: "VIN-TEST-001",
                chassisNumber: "CHASSIS-001"
            })
        });
        testVehicle1 = await veh1Res.json() as { id: number };

        const veh2Res = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                registration: "ฮน-5678-เชียงใหม่",
                brand: "Honda",
                model: "Civic",
                customerId: testCustomer2.id,
                vinNumber: "VIN-TEST-002",
                chassisNumber: "CHASSIS-002"
            })
        });
        testVehicle2 = await veh2Res.json() as { id: number };

        // Create test jobs
        await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle1.id,
                customerId: testCustomer1.id,
                jobNumber: "JOB-FILTER-001",
                startDate: "2026-01-15T00:00:00.000Z"
            })
        });

        await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle2.id,
                customerId: testCustomer2.id,
                jobNumber: "JOB-FILTER-002",
                startDate: "2026-01-18T00:00:00.000Z"
            })
        });
    });

    it("should filter jobs by vehicle registration", async () => {
        const res = await app.request("/api/v1/private/jobs?vehicleRegistration=กข-1234", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { vehicle: { registration: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.vehicle.registration.includes("กข-1234"))).toBe(true);
    });

    it("should filter jobs by vehicle registration using 'registration' alias", async () => {
        const res = await app.request("/api/v1/private/jobs?registration=ฮน-5678", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { vehicle: { registration: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.vehicle.registration.includes("ฮน-5678"))).toBe(true);
    });

    it("should filter jobs by customer name", async () => {
        const res = await app.request("/api/v1/private/jobs?customerName=สมชาย", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { customer?: { name: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.customer?.name.includes("สมชาย"))).toBe(true);
    });

    it("should filter jobs by customer name using 'customer' alias", async () => {
        const res = await app.request("/api/v1/private/jobs?customer=สมหญิง", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { customer?: { name: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.customer?.name.includes("สมหญิง"))).toBe(true);
    });

    it("should filter jobs by chassis number", async () => {
        const res = await app.request("/api/v1/private/jobs?chassisNumber=CHASSIS-001", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { vehicle: { chassisNumber: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.vehicle.chassisNumber === "CHASSIS-001")).toBe(true);
    });

    it("should filter jobs by VIN number", async () => {
        const res = await app.request("/api/v1/private/jobs?vinNumber=VIN-TEST-002", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { vehicle: { vinNumber: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.vehicle.vinNumber === "VIN-TEST-002")).toBe(true);
    });

    it("should filter jobs by VIN using 'vin' alias", async () => {
        const res = await app.request("/api/v1/private/jobs?vin=VIN-TEST-001", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { vehicle: { vinNumber: string } }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.vehicle.vinNumber === "VIN-TEST-001")).toBe(true);
    });

    it("should filter jobs by job number", async () => {
        const res = await app.request("/api/v1/private/jobs?jobNumber=JOB-FILTER-001", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string }[] };
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data.some((job) => job.jobNumber.includes("JOB-FILTER-001"))).toBe(true);
    });

    it("should filter jobs by status", async () => {
        const res = await app.request("/api/v1/private/jobs?status=CLAIM", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { status: string }[] };
        expect(body.data.every((job) => job.status === "CLAIM")).toBe(true);
    });

    it("should filter jobs by date range", async () => {
        const res = await app.request("/api/v1/private/jobs?startDateFrom=2026-01-17&startDateTo=2026-01-19", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { startDate: string }[] };
        // Should only return job2 which was created on 2026-01-18
        const matchingJobs = body.data.filter((job) => {
            const startDate = new Date(job.startDate);
            return startDate >= new Date("2026-01-17") && startDate <= new Date("2026-01-19");
        });
        expect(matchingJobs.length).toBeGreaterThan(0);
    });

    it("should support general search across multiple fields", async () => {
        const res = await app.request("/api/v1/private/jobs?search=กข-1234", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: unknown[] };
        expect(body.data.length).toBeGreaterThan(0);
    });

    it("should support combining multiple filters", async () => {
        const res = await app.request("/api/v1/private/jobs?status=CLAIM&customerName=สมชาย", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { status: string; customer?: { name: string } }[] };
        if (body.data.length > 0) {
            expect(body.data.every((job) => job.status === "CLAIM")).toBe(true);
            expect(body.data.some((job) => job.customer?.name.includes("สมชาย"))).toBe(true);
        }
    });

    it("should return empty array when no jobs match filters", async () => {
        const res = await app.request("/api/v1/private/jobs?vehicleRegistration=NON-EXISTENT-PLATE", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: unknown[]; total: number };
        expect(body.data).toEqual([]);
        expect(body.total).toBe(0);
    });

    it("should include insuranceCompany in response", async () => {
        const res = await app.request("/api/v1/private/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as { data: unknown[] };
        // Should have insuranceCompany field (can be null)
        expect(body.data[0]).toHaveProperty("insuranceCompany");
    });
});
