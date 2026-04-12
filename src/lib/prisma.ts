import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString: string = process.env.DATABASE_URL || "";

const adapter: PrismaPg = new PrismaPg({ connectionString });
const prisma: PrismaClient = new PrismaClient({ adapter });

export { prisma };