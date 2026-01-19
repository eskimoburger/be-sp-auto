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
        const body = await res.json() as { error: string };
        expect(body.error).toBe("Validation Failed");
    });
});
