import type { Context } from "hono";
import { AuthService } from "../services/auth.service";

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 */
export const login = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { username, password } = body;

        if (!username || !password) {
            return c.json({ error: "Username and password are required" }, 400);
        }

        const result = await AuthService.login(username, password);

        if (!result) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        return c.json(result);
    } catch (e) {
        console.error(e);
        return c.json({ error: "Internal Server Error" }, 500);
    }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     description: Invalidate the user session (client-side token removal).
 *     responses:
 *       200:
 *         description: Logout successful
 */
export const logout = async (c: Context) => {
    // Stateless logout usually just means client deletes token.
    // We can return a success message.
    return c.json({ message: "Logout successful" });
};
