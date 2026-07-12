import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env when a prisma.config.ts is present,
// so load it explicitly for CLI commands (migrate, db seed, etc.).
loadEnv();

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    seed: "npx ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts",
  },
});
