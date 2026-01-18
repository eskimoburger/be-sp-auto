import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Vehicle Metadata API (Brands & Types)", () => {
    let token: string;
    let brandId: number;
    let typeId: number;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    describe("Vehicle Brands", () => {
        it("should create a vehicle brand", async () => {
            const res = await app.request("/api/v1/private/vehicles/brands", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: "test-brand-" + Date.now(),
                    name: "Test Brand",
                    nameEn: "Test Brand EN",
                    country: "Test Country"
                })
            });
            expect(res.status).toBe(201);
            const body = (await res.json()) as any;
            brandId = body.id;
            expect(brandId).toBeDefined();
        });

        it("should get all vehicle brands", async () => {
            const res = await app.request("/api/v1/private/vehicles/brands");
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThan(0);
        });

        it("should get vehicle brand by ID", async () => {
            const res = await app.request(`/api/v1/private/vehicles/brands/${brandId}`);
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(body.id).toBe(brandId);
        });

        it("should update vehicle brand", async () => {
            const res = await app.request(`/api/v1/private/vehicles/brands/${brandId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: "Updated Brand Name" })
            });
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(body.name).toBe("Updated Brand Name");
        });

        it("should delete vehicle brand", async () => {
            const res = await app.request(`/api/v1/private/vehicles/brands/${brandId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            expect(res.status).toBe(200);

            const check = await app.request(`/api/v1/private/vehicles/brands/${brandId}`);
            expect(check.status).toBe(404);
        });
    });

    describe("Vehicle Types", () => {
        it("should create a vehicle type", async () => {
            const res = await app.request("/api/v1/private/vehicles/types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: "test-type-" + Date.now(),
                    name: "Test Type",
                    nameEn: "Test Type EN"
                })
            });
            expect(res.status).toBe(201);
            const body = (await res.json()) as any;
            typeId = body.id;
            expect(typeId).toBeDefined();
        });

        it("should get all vehicle types", async () => {
            const res = await app.request("/api/v1/private/vehicles/types");
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThan(0);
        });

        it("should get vehicle type by ID", async () => {
            const res = await app.request(`/api/v1/private/vehicles/types/${typeId}`);
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(body.id).toBe(typeId);
        });

        it("should update vehicle type", async () => {
            const res = await app.request(`/api/v1/private/vehicles/types/${typeId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: "Updated Type Name" })
            });
            expect(res.status).toBe(200);
            const body = (await res.json()) as any;
            expect(body.name).toBe("Updated Type Name");
        });

        it("should delete vehicle type", async () => {
            const res = await app.request(`/api/v1/private/vehicles/types/${typeId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            expect(res.status).toBe(200);

            const check = await app.request(`/api/v1/private/vehicles/types/${typeId}`);
            expect(check.status).toBe(404);
        });
    });
});
