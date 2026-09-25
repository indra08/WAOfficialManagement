import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  driver: "d1-http",
  dbCredentials: {
    token: process.env.CLOUDFLARE_API_TOKEN!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
  },
  dialect: "sqlite",
} satisfies Config;
