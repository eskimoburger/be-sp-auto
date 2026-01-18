import { sign } from "hono/jwt";
import { prisma } from "../lib/prisma"; // Use shared client

export class AuthService {
    static async login(username: string, passwordPlain: string) {
        const user = await prisma.employee.findUnique({
            where: { username },
        });

        if (!user || !user.password) {
            return null;
        }

        const isMatch = await Bun.password.verify(passwordPlain, user.password);
        if (!isMatch) {
            return null;
        }

        const payload = {
            sub: user.id,
            role: user.role,
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
        };

        const secret = process.env.JWT_SECRET || "fallback_secret";
        const token = await sign(payload, secret);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        };
    }
}
