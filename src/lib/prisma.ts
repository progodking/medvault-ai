import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. A single instance is reused across hot reloads and
 * serverless invocations to avoid exhausting the database connection pool.
 */
const g = globalThis as unknown as { __medvaultPrisma?: PrismaClient };

export const prisma = g.__medvaultPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") g.__medvaultPrisma = prisma;
