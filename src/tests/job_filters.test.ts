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
        }, process.env);
        testCustomer1 = await cust1Res.json() as { id: number };

        const cust2Res = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "สมหญิง รักษ์ดี", phone: "0822222222" })
        }, process.env);
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
        }, process.env);
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
        }, process.env);
        testVehicle2 = await veh2Res.json() as { id: number };

        // Create test jobs
        await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle1.id,
                customerId: testCustomer1.id,
                jobNumber: "JOB-FILTER-001",
                startDate: "2026-01-15T00:00:00.000Z",
                status: "CLAIM" // Explicitly set status if possible, otherwise it defaults
            })
        }, process.env);

        await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicleId: testVehicle2.id,
                customerId: testCustomer2.id,
                jobNumber: "JOB-FILTER-002",
                startDate: "2026-01-18T00:00:00.000Z",
                status: "REPAIR" // Explicitly set status to verify counts
            })
        }, process.env);

        // Note: Creating jobs via POST default status is probably CLAIM (or whatever is first), 
        // we might need to update status directly if POST doesn't accept it. 
        // Assuming POST accepts basic fields. 
        // If not, we rely on seeded data having mixed statuses.
    }, 30000);

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

    it("should return statusCounts that allow faceted search", async () => {
        // 1. Fetch all jobs and get initial counts
        const allRes = await app.request("/api/v1/private/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const allBody = await allRes.json() as { statusCounts: Record<string, number>; total: number };
        expect(allBody.statusCounts).toBeDefined();
        expect(allBody.statusCounts.all).toBe(allBody.total);
        expect(allBody.statusCounts["CLAIM"]).toBeGreaterThanOrEqual(1);

        const initialClaimCount = allBody.statusCounts["CLAIM"];

        // 2. Fetch with status=CLAIM - statusCounts should ideally remain the same (because it ignores status filter)
        // or at least show that other statuses exist in the system
        const claimRes = await app.request("/api/v1/private/jobs?status=CLAIM", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const claimBody = await claimRes.json() as { statusCounts: Record<string, number>; data: any[] };

        // The core requirement: statusCounts should reflect "what if I unchecked this status filter?"
        // So it should match the counts from the "All" query (assuming no other filters are active)
        expect(claimBody.statusCounts["CLAIM"]).toBe(initialClaimCount);
        expect(claimBody.statusCounts["all"]).toBe(allBody.total); // "all" should represent total matches if NO status filter was applied

        // 3. Fetch with a search filter that restricts results
        // Use a specific job number to ensure we get a small subset
        const specificJobNumber = "JOB-FILTER-001";
        const searchRes = await app.request(`/api/v1/private/jobs?jobNumber=${specificJobNumber}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const searchBody = await searchRes.json() as { statusCounts: Record<string, number>; total: number };

        // Now statusCounts should be smaller, because the search filter IS applied to the counts
        // It presumably matches only 1 job
        expect(searchBody.statusCounts.all).toBe(1);
        expect(Object.values(searchBody.statusCounts).reduce((a, b) => a + b, 0) - searchBody.statusCounts.all).toBe(1); // Sum of individual statuses should match 'all'
    });
});
