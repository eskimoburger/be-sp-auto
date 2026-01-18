import { Prisma } from "@prisma/client";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorMiddleware = async (c: Context, next: Next) => {
    try {
        await next();
    } catch (err: any) {
        if (err instanceof HTTPException) {
            return err.getResponse();
        }

        console.error("Global Error Handler:", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return c.json(
                    {
                        error: "Conflict",
                        details: "A record with this unique field already exists (e.g., username, registration code)."
                    },
                    409
                );
            }
            if (err.code === "P2025") {
                return c.json(
                    {
                        error: "Not Found",
                        details: "Record not found"
                    },
                    404
                );
            }
        }

        if (err instanceof Prisma.PrismaClientValidationError) {
            return c.json(
                {
                    error: "Validation Error",
                    details: "db validation error"
                },
                400
            );
        }

        return c.json(
            {
                error: "Internal Server Error",
                message: process.env.NODE_ENV === "development" ? err.message : undefined
            },
            500
        );
    }
};
