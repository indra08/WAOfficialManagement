import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import * as schema from "@/db/schema";

// ── Dapatkan instance D1 Drizzle untuk request ini ────────────────────────────
// next-on-pages menyalin D1 binding ke globalThis.DB saat edge runtime berjalan.
export function getDb() {
  const binding = (globalThis as any).DB;
  if (binding && typeof (binding as any).prepare === "function") {
    return drizzle(binding, { schema });
  }
  return undefined;
}

export function useDb() {
  const db = getDb();
  if (!db) throw new Error("D1 database tidak tersedia. Pastikan binding 'DB' dikonfigurasi.");
  return db;
}

// Lazy db proxy untuk backward-compat dengan assertDb()
// assertDb() melakukan 'if (!db)' — Proxy ini membuat db terlihat seperti object Drizzle
// namun hanya aktif saat ada binding D1 nyata.
const dbProxy = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_target, prop) {
      const d = getDb();
      if (!d) throw new Error("D1 database tidak tersedia.");
      return (d as any)[prop];
    },
    has(_target, prop) {
      return !!getDb();
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  }
);
export { dbProxy as db };

// ── Seed user testing (maulana@mail.com / insantech02) ────────────────────────
export async function seed(): Promise<void> {
  const db = getDb();
  if (!db) return;

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

export type DB = ReturnType<typeof drizzle>;
export type User = typeof schema.users.$inferSelect;
export type Company = typeof schema.companies.$inferSelect;
export type WhatsAppBusinessAccount = typeof schema.whatsappBusinessAccounts.$inferSelect;
export type Contact = typeof schema.contacts.$inferSelect;
export type Conversation = typeof schema.conversations.$inferSelect;
export type Message = typeof schema.messages.$inferSelect;
export type EmbeddedSignup = typeof schema.whatsappEmbeddedSignups.$inferSelect;
export type AppConnection = typeof schema.whatsappAppConnections.$inferSelect;
