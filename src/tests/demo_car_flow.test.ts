import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "../index";
import { getAuthToken } from "./test_helper";

describe("Demo: Old vs New Car Job Creation Flow", () => {
    let token: string;
    let testCustomer: { id: number; name: string };
    let existingVehicle: { id: number; registration: string };

    beforeAll(async () => {
        token = await getAuthToken();

        // 1. Setup: Create a Customer
        const custRes = await app.request("/api/v1/private/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: `Demo Customer ${Date.now()}`, phone: "0812345678" })
        }, process.env);
        testCustomer = await custRes.json() as { id: number; name: string };

        // 2. Setup: Create an "Old Car" (Existing Vehicle)
        const vehRes = await app.request("/api/v1/private/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                registration: `OLD-CAR-${Date.now()}`,
                brand: "Toyota",
                model: "Camry",
                customerId: testCustomer.id
            })
        }, process.env);
        existingVehicle = await vehRes.json() as { id: number; registration: string };
        console.log(`[Setup] Created Old Car: ID=${existingVehicle.id}, Reg=${existingVehicle.registration}`);
    }, 30000);

    it("Scenario 1: Old Car - Should pull existing data (reuse ID)", async () => {
        // We pass the registration of the existing car
        // We do NOT pass vehicleId, simulating the user just filling in the form
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    registration: existingVehicle.registration, // Matches existing
                    brand: "Toyota"
                },
                customerId: testCustomer.id,
                startDate: "2026-01-22T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; vehicleId: number };

        console.log(`[Scenario 1] Job Created: ID=${job.id}, Linked VehicleID=${job.vehicleId}`);

        // VERIFICATION: The job should be linked to the EXISTING vehicle ID
        expect(job.vehicleId).toBe(existingVehicle.id);
    }, 30000);

    it("Scenario 2: New Car - Should create new vehicle", async () => {
        const newCarReg = `NEW-CAR-${Date.now()}`;

        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    registration: newCarReg, // Brand new registration
                    brand: "Honda",
                    model: "Civic",
                    color: "Red"
                },
                customerId: testCustomer.id,
                startDate: "2026-01-22T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; vehicleId: number };

        console.log(`[Scenario 2] Job Created: ID=${job.id}, Linked VehicleID=${job.vehicleId}`);

        // VERIFICATION: The job should be linked to a NEW vehicle ID (not the old one)
        expect(job.vehicleId).not.toBe(existingVehicle.id);

        // Double check the new vehicle exists
        const vehCheck = await app.request(`/api/v1/private/vehicles?reg=${newCarReg}`, {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        const vehicles = await vehCheck.json() as { id: number }[];
        if (vehicles[0]) {
            expect(vehicles[0].id).toBe(job.vehicleId);
        }
    }, 30000);

    it("Scenario 3: Old Car (Reg Only) - Should pull existing data without brand", async () => {
        // Pass ONLY registration, no brand
        const res = await app.request("/api/v1/private/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                vehicle: {
                    registration: existingVehicle.registration
                    // Brand is missing! Should still work for existing car.
                },
                customerId: testCustomer.id,
                startDate: "2026-01-22T00:00:00.000Z"
            })
        }, process.env);

        expect(res.status).toBe(201);
        const job = await res.json() as { id: number; vehicleId: number };

        console.log(`[Scenario 3] Job Created (Reg Only): ID=${job.id}, Linked VehicleID=${job.vehicleId}`);
        expect(job.vehicleId).toBe(existingVehicle.id);
    }, 30000);
});
