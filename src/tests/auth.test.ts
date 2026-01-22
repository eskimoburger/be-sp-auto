import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import bcrypt from "bcryptjs";
import { app } from "../index";
import { prisma } from "../lib/prisma";

describe("Auth Module", () => {
    let token: string;
    const testUser = {
        name: "Auth Test User",
        username: "authtest",
        password: "password123",
        role: "admin"
    };

    beforeAll(async () => {
        // Create test user
        const passwordHash = await bcrypt.hash(testUser.password, 10);
        await prisma.employee.upsert({
            where: { username: testUser.username },
            update: { password: passwordHash },
            create: {
                name: testUser.name,
                username: testUser.username,
                password: passwordHash,
                role: testUser.role
            }
        });
    });

    afterAll(async () => {
        // Cleanup
        await prisma.employee.delete({ where: { username: testUser.username } });
    });

    it("should login with valid credentials", async () => {
        const res = await app.request("/api/v1/public/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: testUser.username, password: testUser.password })
        }, process.env);

        expect(res.status).toBe(200);
        const body = (await res.json()) as { token: string; user: { username: string } };
        expect(body).toHaveProperty("token");
        expect(body.user).toHaveProperty("username", testUser.username);
        token = body.token;
    });

    it("should fail login with invalid credentials", async () => {
        const res = await app.request("/api/v1/public/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: testUser.username, password: "wrongpassword" })
        }, process.env);

        expect(res.status).toBe(401);
    });

    it("should protect private routes", async () => {
        const res = await app.request("/api/v1/private/profile", {}, process.env);
        expect(res.status).toBe(401);
    });

    it("should access private route with valid token", async () => {
        if (!token) { throw new Error("Token not obtained from login test"); }

        const res = await app.request("/api/v1/private/profile", {
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);

        expect(res.status).toBe(200);
        const body = (await res.json()) as { token: string; user: { username: string } };
        expect(body).toHaveProperty("message", "You are accessing a private route!");
        expect(body.user).toHaveProperty("username", testUser.username);
    });

    it("should logout successfully", async () => {
        const res = await app.request("/api/v1/public/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }, process.env);
        expect(res.status).toBe(200);
        const body = (await res.json()) as { message: string };
        expect(body).toHaveProperty("message", "Logout successful");
    });
});
