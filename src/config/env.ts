import { z } from "zod";
import { logger } from "../lib/logger";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

console.log(process.env.JWT_SECRET);
console.log(process.env.NODE_ENV);

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error(
    { errors: parsed.error.flatten().fieldErrors },
    "Invalid environment variables"
  );

  process.exit(1);
}

export const env = parsed.data;