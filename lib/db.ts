/// <reference types="@cloudflare/workers-types/latest" />
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import * as schema from "@/db/schema";

// ── Dapatkan binding D1 dari request context ────────────────────────────────
function getD1Binding(): D1Database | null {
  const ctx = getOptionalRequestContext();
  if (!ctx) return null;
  const env = ctx.env as { DB?: D1Database } | undefined;
  const binding = env?.DB;
  if (binding && typeof (binding as any).prepare === "function") {
    return binding;
  }
  return null;
}

// ── Dapatkan instance Drizzle D1 untuk request saat ini ──────────────────────
export async function useDb(_request?: Request): Promise<ReturnType<typeof drizzleD1> | null> {
  const d1 = getD1Binding();
  if (d1) return drizzleD1(d1, { schema });
  return null;
}

// ── Proxy db (sync) untuk seed() dan backward-compat ────────────────────────
const dbProxy = new Proxy(
  {} as ReturnType<typeof drizzleD1>,
  {
    get(_target, prop) {
      return async (...args: any[]) => {
        const d1 = getD1Binding();
        if (!d1) throw new Error("D1 database tidak tersedia.");
        const db = drizzleD1(d1, { schema });
        return (db as any)[prop](...args);
      };
    },
    has(_target, prop) {
      return true;
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  }
);
export { dbProxy as db };

// ── Seed user testing (maulana@mail.com / insantech02) ────────────────────────
export async function seed(): Promise<void> {
  const d1 = getD1Binding();
  if (!d1) return;
  const db = drizzleD1(d1, { schema });

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, "maulana@mail.com"))
    .limit(1);

  if (existing.length > 0) return;

  const now = new Date();
  const [company] = await db
    .insert(schema.companies)
    .values({ name: "Insantech", subdomain: "insantech", isActive: true, createdAt: now, updatedAt: now })
    .returning({ id: schema.companies.id });

  await db.insert(schema.users).values({
    email: "maulana@mail.com",
    passwordHash: hashSync("insantech02", 12),
    name: "Maulana",
    companyId: company!.id,
    role: "admin",
    isVerified: true,
    createdAt: now,
    updatedAt: now,
  });

  console.log("[DB] Seed user testing: maulana@mail.com");
}

export type DB = Awaited<ReturnType<typeof useDb>>;
export type User = typeof schema.users.$inferSelect;
export type Company = typeof schema.companies.$inferSelect;
export type WhatsAppBusinessAccount = typeof schema.whatsappBusinessAccounts.$inferSelect;
export type Contact = typeof schema.contacts.$inferSelect;
export type Conversation = typeof schema.conversations.$inferSelect;
export type Message = typeof schema.messages.$inferSelect;
export type EmbeddedSignup = typeof schema.whatsappEmbeddedSignups.$inferSelect;
export type AppConnection = typeof schema.whatsappAppConnections.$inferSelect;
