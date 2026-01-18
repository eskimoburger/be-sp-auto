import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export const authMiddleware = (c: Context, next: Next) => {
    // Public routes exclusion (GET only for listing and individual items)
    const publicGetPaths = ['/api/v1/private/vehicles/brands', '/api/v1/private/vehicles/types'];
    if (c.req.method === 'GET' && publicGetPaths.some(path => c.req.path.startsWith(path))) {
        return next();
    }

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
