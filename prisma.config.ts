import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

// Neon (and the Vercel integration that provisions it) gives two connection
// strings: DATABASE_URL (pooled, via PgBouncer) for app query traffic, and
// DATABASE_URL_UNPOOLED (direct) for migrations — pooled connections don't
// support the session state Prisma Migrate relies on. CLI commands (migrate,
// studio, db execute) read this config, so point them at the direct one when
// it's available; the runtime adapter in src/lib/db.ts reads DATABASE_URL
// directly and keeps using the pooled connection regardless.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED || env("DATABASE_URL"),
  },
});
