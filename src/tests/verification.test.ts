import { describe, expect, it, afterAll } from "bun:test";
import { app } from "../index";
import { prisma } from "../lib/prisma";

describe("Verification Tests", () => {

    // Clean up
    afterAll(async () => {
        await prisma.employee.deleteMany({ where: { username: "verify_user" } });
    });

    it("should hash password when creating employee", async () => {
        const payload = {
            name: "Verification User",
            username: "verify_user",
            password: "plain_password_123",
            role: "staff"
        };

        // Use service directly or API? API ensures middleware runs.
        const req = new Request("http://localhost/api/v1/private/employees", {
            method: "POST",
            headers: {
                // Creating employee requires auth, but we might not have a token easily in test without logging in.
                // For verification, we can use Service directly to check the Hashing logic specifically, 
                // or we can Mock the auth middleware if we want to test API.
                // Let's test Service directly for Hashing logic as it's the core security requirement.
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Testing Service Logic Directly for Hashing
        const { EmployeeService } = await import("../services/employee.service");
        // Pass a copy because create mutates the object
        const employee = await EmployeeService.create({ ...payload });

        expect(employee.password).not.toBe(payload.password);
        expect(employee.password).not.toBe("plain_password_123");
        expect(employee.password?.startsWith("$argon2")).toBe(true); // Bun.password.hash uses argon2 by default often

        // Clean up immediately
        await prisma.employee.delete({ where: { id: employee.id } });
    });

    it("should reject login with invalid inputs (Validation Middleware)", async () => {
        const req = new Request("http://localhost/api/v1/public/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "" }) // Missing password, empty username
        });
        const res = await app.fetch(req);
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe("Validation Failed");
    });
});
