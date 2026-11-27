import { PrismaPg } from "@prisma/adapter-pg";
// Path relatif: auth CLI (better-auth) memuat berkas ini tanpa alias tsconfig.
import { PrismaClient } from "../generated/prisma/client";

// Singleton: hot-reload Next.js akan membuat klien baru tiap reload kalau tidak
// disimpan di globalThis, dan tiap klien membawa connection pool sendiri.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Nama ekspor yang dipakai docs/rancangan-database.md.
export const db = prisma;
