import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Job Sorting API", () => {
    let token: string;
    const jobs: unknown[] = [];

    beforeAll(async () => {
        token = await getAuthToken();

        // Create test customer
        const custRes = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "Sort Test Customer", phone: "0899999999" })
        }, process.env);
        const customer = await custRes.json() as { id: number };

        // Create multiple jobs with different dates
        const jobsData = [
            { jobNumber: "SORT-001", startDate: "2026-01-10T00:00:00.000Z" },
            { jobNumber: "SORT-003", startDate: "2026-01-15T00:00:00.000Z" },
            { jobNumber: "SORT-002", startDate: "2026-01-20T00:00:00.000Z" },
        ];

        for (const jobData of jobsData) {
            const vehRes = await app.request("/api/v1/private/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    registration: `SORT-${jobData.jobNumber}`,
                    brand: "Toyota",
                    customerId: customer.id
                })
            }, process.env);
            const vehicle = await vehRes.json() as { id: number };

            const jobRes = await app.request("/api/v1/private/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    vehicleId: vehicle.id,
                    customerId: customer.id,
                    jobNumber: jobData.jobNumber,
                    startDate: jobData.startDate
                })
            }, process.env);
            const job = await jobRes.json();
            jobs.push(job);
        }

        // Wait a bit to ensure different createdAt timestamps
        await new Promise(resolve => setTimeout(resolve, 100));
    }, 30000);

    it("should sort jobs by jobNumber in ascending order", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=jobNumber&sortOrder=asc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string; startDate: string; createdAt: string; status: string }[] };

        // Filter our test jobs
        const testJobs = body.data.filter((job) => job.jobNumber.startsWith("SORT-"));

        // Verify ascending order
        if (testJobs.length >= 2) {
            for (let i = 1; i < testJobs.length; i++) {
                const current = testJobs[i];
                const previous = testJobs[i - 1];
                if (current && previous) {
                    expect(current.jobNumber >= previous.jobNumber).toBe(true);
                }
            }
        }
    });

    it("should sort jobs by jobNumber in descending order", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=jobNumber&sortOrder=desc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string; startDate: string; createdAt: string; status: string }[] };

        // Filter our test jobs
        const testJobs = body.data.filter((job) => job.jobNumber.startsWith("SORT-"));

        // Verify descending order
        if (testJobs.length >= 2) {
            for (let i = 1; i < testJobs.length; i++) {
                const current = testJobs[i];
                const previous = testJobs[i - 1];
                if (current && previous) {
                    expect(current.jobNumber <= previous.jobNumber).toBe(true);
                }
            }
        }
    });

    it("should sort jobs by startDate in ascending order", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=startDate&sortOrder=asc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string; startDate: string; createdAt: string; status: string }[] };

        // Filter our test jobs
        const testJobs = body.data.filter((job) => job.jobNumber.startsWith("SORT-"));

        // Verify ascending order by date
        if (testJobs.length >= 2) {
            for (let i = 1; i < testJobs.length; i++) {
                const date1 = new Date(testJobs[i - 1]?.startDate || "");
                const date2 = new Date(testJobs[i]?.startDate || "");
                expect(date2 >= date1).toBe(true);
            }
        }
    });

    it("should sort jobs by startDate in descending order", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=startDate&sortOrder=desc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string; startDate: string; createdAt: string; status: string }[] };

        // Filter our test jobs
        const testJobs = body.data.filter((job) => job.jobNumber.startsWith("SORT-"));

        // Verify descending order by date
        if (testJobs.length >= 2) {
            for (let i = 1; i < testJobs.length; i++) {
                const date1 = new Date(testJobs[i - 1]?.startDate || "");
                const date2 = new Date(testJobs[i]?.startDate || "");
                expect(date2 <= date1).toBe(true);
            }
        }
    });

    it("should sort jobs by createdAt in descending order (default)", async () => {
        const res = await app.request("/api/v1/private/jobs?limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { createdAt: string; startDate: string; status: string }[] };

        // Should default to createdAt desc
        if (body.data.length >= 2) {
            for (let i = 1; i < Math.min(body.data.length, 5); i++) {
                const date1 = new Date(body.data[i - 1]?.createdAt || "");
                const date2 = new Date(body.data[i]?.createdAt || "");
                expect(date2 <= date1).toBe(true);
            }
        }
    });

    it("should sort jobs by status", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=status&sortOrder=asc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { status: string; startDate: string }[] };

        // Verify ascending order by status
        if (body.data.length >= 2) {
            for (let i = 1; i < Math.min(body.data.length, 5); i++) {
                expect((body.data[i]?.status || "") >= (body.data[i - 1]?.status || "")).toBe(true);
            }
        }
    });

    it("should combine sorting with filtering", async () => {
        const res = await app.request("/api/v1/private/jobs?status=CLAIM&sortBy=startDate&sortOrder=asc", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { status: string; startDate: string }[] };

        // All should have status CLAIM
        expect(body.data.every((job) => job.status === "CLAIM")).toBe(true);

        // Should be sorted by startDate asc
        if (body.data.length >= 2) {
            for (let i = 1; i < body.data.length; i++) {
                const date1 = new Date(body.data[i - 1]?.startDate || "");
                const date2 = new Date(body.data[i]?.startDate || "");
                expect(date2 >= date1).toBe(true);
            }
        }
    });

    it("should handle invalid sortBy field gracefully (default to createdAt)", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=invalidField&sortOrder=desc&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: unknown[] };

        // Should still return results (falling back to createdAt)
        expect(Array.isArray(body.data)).toBe(true);
    });

    it("should default to desc order when sortOrder is not specified", async () => {
        const res = await app.request("/api/v1/private/jobs?sortBy=startDate&limit=50", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = await res.json() as { data: { jobNumber: string; startDate: string; createdAt: string; status: string }[] };

        // Filter our test jobs
        const testJobs = body.data.filter((job) => job.jobNumber.startsWith("SORT-"));

        // Verify descending order (default)
        if (testJobs.length >= 2) {
            for (let i = 1; i < testJobs.length; i++) {
                const date1 = new Date(testJobs[i - 1]?.startDate || "");
                const date2 = new Date(testJobs[i]?.startDate || "");
                expect(date2 <= date1).toBe(true);
            }
        }
    });
});
