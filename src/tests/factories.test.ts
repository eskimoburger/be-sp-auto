import { describe, expect, it, beforeAll, afterEach } from "bun:test";
import { prisma } from "../lib/prisma";
import { DataFactory } from "./factories";

describe("DataFactory", () => {
    // Clean DB before each test to prevent unique constraint violations
    // and ensure isolation.
    beforeAll(async () => {
        await DataFactory.cleanDb();
    });

    afterEach(async () => {
        await DataFactory.cleanDb();
    });

    // Basic Creation Tests
    it("should create a customer", async () => {
        const customer = await DataFactory.createCustomer();
        expect(customer).toBeDefined();
        expect(customer.id).toBeDefined();
        expect(customer.name).toBeDefined();
    });

    it("should create a vehicle linked to a customer", async () => {
        const customer = await DataFactory.createCustomer();
        const vehicle = await DataFactory.createVehicle(customer.id);

        expect(vehicle).toBeDefined();
        expect(vehicle.customerId).toBe(customer.id);
        expect(vehicle.brand).toBeDefined();
    });

    it("should create a job linked to vehicle and customer", async () => {
        const customer = await DataFactory.createCustomer();
        const vehicle = await DataFactory.createVehicle(customer.id);
        const job = await DataFactory.createJob(vehicle.id, customer.id, "REPAIR");

        expect(job).toBeDefined();
        expect(job.vehicleId).toBe(vehicle.id);
        expect(job.customerId).toBe(customer.id);
        expect(job.status).toBe("REPAIR");
    });

    it("should create an employee", async () => {
        const employee = await DataFactory.createEmployee({ role: "admin" });
        expect(employee).toBeDefined();
        expect(employee.role).toBe("admin");
    });

    // Overrides Verification
    it("should create a customer with overrides", async () => {
        const overrideData = {
            name: "Custom Name",
            phone: "0812345678"
        };
        const customer = await DataFactory.createCustomer(overrideData);
        expect(customer.name).toBe(overrideData.name);
        expect(customer.phone).toBe(overrideData.phone);
    });

    it("should create a vehicle with specific registration", async () => {
        const customer = await DataFactory.createCustomer();
        const registration = "XY-9999";
        const vehicle = await DataFactory.createVehicle(customer.id, { registration });

        expect(vehicle.registration).toBe(registration);
    });

    it("should create a job with specific details", async () => {
        const customer = await DataFactory.createCustomer();
        const vehicle = await DataFactory.createVehicle(customer.id);
        const customJobNumber = "JOB-TEST-001";

        const job = await DataFactory.createJob(vehicle.id, customer.id, "CLAIM", {
            jobNumber: customJobNumber,
            repairDescription: "Fix bumper"
        });

        expect(job.jobNumber).toBe(customJobNumber);
        expect(job.repairDescription).toBe("Fix bumper");
        expect(job.status).toBe("CLAIM");
    });

    // Optional Relationships & Edge Cases
    it("should create a vehicle without a customer (orphaned)", async () => {
        const vehicle = await DataFactory.createVehicle(null);
        expect(vehicle.customerId).toBeNull();
    });

    it("should create a job with an insurance company", async () => {
        // Need an insurance company first. Seeded data should exists.
        const insurance = await prisma.insuranceCompany.findFirst();
        if (!insurance) {throw new Error("Seeding required for this test");}

        const customer = await DataFactory.createCustomer();
        const vehicle = await DataFactory.createVehicle(customer.id);

        const job = await DataFactory.createJob(vehicle.id, customer.id, "CLAIM", {
            insuranceCompanyId: insurance.id
        });

        expect(job.insuranceCompanyId).toBe(insurance.id);
    });

    // Data Integrity
    it("should have valid default timestamps", async () => {
        const customer = await DataFactory.createCustomer();
        expect(customer.createdAt).toBeInstanceOf(Date);
        expect(customer.updatedAt).toBeInstanceOf(Date);
        // timestamp check: created recently
        const now = new Date();
        const diff = now.getTime() - customer.createdAt.getTime();
        expect(diff).toBeLessThan(5000); // Created within last 5 seconds
    });
});
