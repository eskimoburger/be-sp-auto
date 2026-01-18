import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export const authMiddleware = (c: Context, next: Next) => {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const jwtMiddleware = jwt({
        secret: secret,
        alg: "HS256",
    });
    return jwtMiddleware(c, next);
};

// Optional: Role based middleware
export const requireAdmin = async (c: Context, next: Next) => {
    const payload = c.get('jwtPayload');
    if (!payload || payload.role !== 'admin') {
        return c.json({ error: "Forbidden" }, 403);
    }
    await next();
};
