import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Vehicle API", () => {
    let vehicleId: number;
    const testReg = `TEST-DUP-${Date.now()}`;
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should create a vehicle", async () => {
        const res = await app.request("/api/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                registration: testReg,
                brand: "Honda",
                model: "Civic"
            })
        });
        expect(res.status).toBe(201);
        const body = await res.json() as any;
        vehicleId = body.id;
    });

    it("should fail to create duplicate vehicle", async () => {
        const res = await app.request("/api/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                registration: testReg,
                brand: "Honda",
                model: "Civic"
            })
        });
        expect(res.status).toBe(400);
    });

    it("should get all vehicles", async () => {
        const res = await app.request("/api/vehicles", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
    });

    it("should find vehicle by registration", async () => {
        const listRes = await app.request("/api/vehicles", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const body = await listRes.json() as any;
        const list = body.data;
        const target = list[0];

        const res = await app.request(`/api/vehicles?reg=${target.registration}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
        const searchBody = await res.json() as any[];
        expect(searchBody.length).toBe(1);
        expect(searchBody[0].id).toBe(target.id);
    });

    it("should update vehicle", async () => {
        const res = await app.request(`/api/vehicles/${vehicleId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ color: "Red" })
        });
        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.color).toBe("Red");
    });
});
