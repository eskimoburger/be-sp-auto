import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Job List API", () => {
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should get all jobs", async () => {
        const res = await app.request("/api/jobs", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0].vehicle).toBeDefined();

        // Test pagination params
        const page2Res = await app.request("/api/jobs?page=2&limit=1", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(page2Res.status).toBe(200);
    });
});
