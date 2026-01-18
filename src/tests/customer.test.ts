import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Customer API", () => {
    let customerId: number;
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should create a customer", async () => {
        const res = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: "Jane Doe", phone: "0999999999" })
        });
        expect(res.status).toBe(201);
        const body = await res.json() as any;
        customerId = body.id;
    });

    it("should get all customers", async () => {
        const res = await app.request("/api/v1/private/customers", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.data).toBeDefined();
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.total).toBeDefined();
    });

    it("should get customer by id", async () => {
        const res = await app.request(`/api/v1/private/customers/${customerId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.id).toBe(customerId);
    });

    it("should return 404 for non-existent customer", async () => {
        const res = await app.request("/api/v1/private/customers/999999", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(404);
    });

    it("should search customers", async () => {
        const res = await app.request("/api/v1/private/customers?q=Jane", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any[];
        expect(body.length).toBeGreaterThan(0);
        expect(body[0].name).toContain("Jane");
    });

    it("should update customer", async () => {
        const res = await app.request(`/api/v1/private/customers/${customerId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ address: "123 Main St" })
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.address).toBe("123 Main St");
    });
});
