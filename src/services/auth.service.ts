import { sign } from "hono/jwt";
import { prisma } from "../lib/prisma"; // Use shared client
import bcrypt from "bcryptjs";

export class AuthService {
    static async login(username: string, passwordPlain: string, jwtSecret: string) {
        const user = await prisma.employee.findUnique({
            where: { username }
        });

        if (!user?.password) {
            return null;
        }

        const isMatch = await bcrypt.compare(passwordPlain, user.password);
        if (!isMatch) {
            return null;
        }

        const payload = {
            sub: user.id,
            role: user.role,
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 1 day expiration
        };

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = await sign(payload, jwtSecret);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        };
    }
}
