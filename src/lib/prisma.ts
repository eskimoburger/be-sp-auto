import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("TURSO_DATABASE_URL:", connectionString);

const adapter = new PrismaLibSql({
    url: connectionString!,
    authToken: authToken
});

// Initialize Prisma Client
export const prisma = new PrismaClient({ adapter });
