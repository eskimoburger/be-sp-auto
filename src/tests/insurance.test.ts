import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Insurance API", () => {
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should return seeded insurance companies", async () => {
        const res = await app.request("/api/v1/private/insurances", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.data).toBeDefined();
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0]).toHaveProperty("logoUrl");
    });

    it("should search for insurance company", async () => {
        const res = await app.request("/api/v1/private/insurances?q=วิริยะ", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.data.some((ins: any) => ins.name.includes("วิริยะ"))).toBe(true);
    });

    it("should create a new insurance company", async () => {
        const newInsurance = {
            name: "Test Insurance",
            contactPhone: "02-123-4567",
            logoUrl: "https://example.com/logo.png"
        };
        const res = await app.request("/api/v1/private/insurances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newInsurance),
        });

        expect(res.status).toBe(201);
        const body = await res.json() as any;
        expect(body).toHaveProperty("id");
        expect(body.name).toBe(newInsurance.name);
    });

    it("should update an insurance company", async () => {
        // First get one
        const getRes = await app.request("/api/v1/private/insurances", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const list = await getRes.json() as any;
        const target = list.data[0];

        const updateData = { name: target.name + " UPDATED" };
        const res = await app.request(`/api/v1/private/insurances/${target.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });

        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.name).toBe(updateData.name);
    });

    it("should delete an insurance company", async () => {
        // Create one to delete
        const createRes = await app.request("/api/v1/private/insurances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: "To Be Deleted" }),
        });
        const created = await createRes.json() as any;

        const res = await app.request(`/api/v1/private/insurances/${created.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.success).toBe(true);
    });
});
