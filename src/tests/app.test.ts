import { describe, expect, it, mock } from "bun:test";
import { app } from "../index";

describe("Health Check", () => {
    it("should return 200 OK", async () => {
        const res = await app.request("/health");
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty("status", "ok");
        expect(body).toHaveProperty("timestamp");
    });
});

describe("Root Endpoint", () => {
    it("should return Hello message", async () => {
        const res = await app.request("/");
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Hello Hono + Bun + Turso!");
    });
});
