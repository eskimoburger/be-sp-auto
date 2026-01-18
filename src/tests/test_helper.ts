import { app } from "../index";
import { prisma } from "../lib/prisma";

export const getAuthToken = async () => {
    const testUser = {
        name: "Test Admin",
        username: "test_admin",
        password: "password123",
        role: "admin"
    };

    // Ensure test user exists
    const passwordHash = await Bun.password.hash(testUser.password);
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

    const res = await app.request("/api/v1/public/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: testUser.username, password: testUser.password }),
    });

    if (res.status !== 200) {
        throw new Error(`Failed to login in test helper: ${res.status}`);
    }

    const body = await res.json() as any;
    return body.token;
};

export const cleanupTestUser = async () => {
    await prisma.employee.deleteMany({ where: { username: "test_admin" } });
};
