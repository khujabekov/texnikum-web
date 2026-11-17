import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function resolveDbUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const filePath = raw.replace(/^file:/, "");
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), filePath);
  return "file:" + absolute;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: resolveDbUrl() }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
