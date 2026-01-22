import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import type { Context } from "hono";

// For local development, still use singleton
let localPrismaInstance: PrismaClient | null = null;

// Store env for creating per-request instances
let storedEnv: any = null;

// Key for storing Prisma client in Hono context
const PRISMA_CONTEXT_KEY = "prisma";

/**
 * Creates a fresh Prisma client for Cloudflare Workers.
 * In Workers, each request needs its own client to avoid I/O context issues.
 */
export const createPrismaClient = (env: any): PrismaClient => {
    const connectionString = env?.TURSO_DATABASE_URL || (typeof process !== "undefined" ? process.env?.TURSO_DATABASE_URL : undefined);
    const authToken = env?.TURSO_AUTH_TOKEN || (typeof process !== "undefined" ? process.env?.TURSO_AUTH_TOKEN : undefined);

    if (!connectionString) {
        throw new Error("TURSO_DATABASE_URL not found in environment");
    }

    const adapter = new PrismaLibSql({
        url: connectionString,
        authToken: authToken
    });
    return new PrismaClient({ adapter });
};

export const initPrisma = (env: any) => {
    storedEnv = env;

    // Only create singleton for local dev (non-Workers environment)
    const isLocalDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

    if (isLocalDev && !localPrismaInstance) {
        console.log("Initializing Prisma (local dev mode)...");
        localPrismaInstance = createPrismaClient(env);
    }
};

/**
 * Get or create a Prisma client.
 * - In local dev: returns singleton for better performance
 * - In Workers: expects client to be in Hono context, creates fresh if not
 */
export const getPrisma = (env?: any, context?: Context): PrismaClient => {
    const effectiveEnv = env || storedEnv;

    // Local dev: use singleton
    const isLocalDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";
    if (isLocalDev) {
        if (!localPrismaInstance) {
            localPrismaInstance = createPrismaClient(effectiveEnv);
        }
        return localPrismaInstance;
    }

    // Workers: try to get from Hono context first
    if (context) {
        const contextPrisma = context.get(PRISMA_CONTEXT_KEY);
        if (contextPrisma instanceof PrismaClient) {
            return contextPrisma;
        }
    }

    // Workers: create fresh instance (should not happen if middleware is set up correctly)
    return createPrismaClient(effectiveEnv);
};

/**
 * Middleware helper: Creates and stores Prisma client in Hono context for Workers
 * This ensures the same Prisma instance is used throughout the request
 */
export const setContextPrisma = (context: Context, env: any): PrismaClient => {
    const isLocalDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

    if (isLocalDev) {
        // Local dev: use singleton
        if (!localPrismaInstance) {
            localPrismaInstance = createPrismaClient(env);
        }
        return localPrismaInstance;
    }

    // Workers: check if already in context
    const existing = context.get(PRISMA_CONTEXT_KEY);
    if (existing instanceof PrismaClient) {
        return existing;
    }

    // Create new instance for this request and store in context
    const client = createPrismaClient(env);
    context.set(PRISMA_CONTEXT_KEY, client);
    return client;
};

// Legacy proxy for backward compatibility
// WARNING: This may still cause issues in Workers if used improperly
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        const isLocalDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

        if (isLocalDev) {
            if (!localPrismaInstance && storedEnv) {
                localPrismaInstance = createPrismaClient(storedEnv);
            }
            if (!localPrismaInstance) {
                throw new Error("Prisma not initialized. Call initPrisma(env) first.");
            }
            return (localPrismaInstance as any)[prop];
        }

        // For Workers, we need per-request instances stored in context
        // Try to get from the request-scoped variable set by middleware
        if (typeof globalThis !== "undefined") {
            const requestPrisma = (globalThis as any).__requestPrisma;
            if (requestPrisma instanceof PrismaClient) {
                return (requestPrisma as any)[prop];
            }
        }

        // Fallback: create new instance (not recommended for transactions)
        if (!storedEnv) {
            throw new Error("Prisma not initialized. Call initPrisma(env) first.");
        }
        const instance = createPrismaClient(storedEnv);
        return (instance as any)[prop];
    }
});

/**
 * Set the request-scoped Prisma instance for Workers
 * This should be called at the start of each request
 */
export const setRequestPrisma = (client: PrismaClient) => {
    if (typeof globalThis !== "undefined") {
        (globalThis as any).__requestPrisma = client;
    }
};

/**
 * Clear the request-scoped Prisma instance
 * This should be called at the end of each request
 */
export const clearRequestPrisma = () => {
    if (typeof globalThis !== "undefined") {
        delete (globalThis as any).__requestPrisma;
    }
};
