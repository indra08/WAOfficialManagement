import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import * as schema from "@/db/schema";

const DB_PATH = process.env.DATABASE_URL?.startsWith("file:")
  ? process.env.DATABASE_URL.replace("file:", "")
  : process.env.DATABASE_URL || "./data/app.db";

// Pastikan direktori database ada
fs.mkdirSync(path.dirname(path.resolve(DB_PATH)), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// ── Bootstrap: buat tables bila belum ada (local dev, tanpa migration tool) ──
sqlite.exec(`
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  plan_id TEXT,
  subscription_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  settings TEXT DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  max_companies INTEGER NOT NULL DEFAULT 1,
  max_whatsapp_accounts INTEGER NOT NULL DEFAULT 1,
  max_contacts INTEGER NOT NULL DEFAULT 1000,
  max_team_members INTEGER NOT NULL DEFAULT 3,
  features TEXT DEFAULT '[]',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start INTEGER,
  current_period_end INTEGER,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS meta_businesses (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  meta_business_account_id TEXT NOT NULL UNIQUE,
  business_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  access_token TEXT,
  access_token_expiry INTEGER,
  phone_account_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS whatsapp_business_accounts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  phone_number_id TEXT NOT NULL UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'inactive',
  quality_rating TEXT,
  name TEXT,
  last_synced_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS whatsapp_phone_numbers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE,
  display_name TEXT,
  auth_token TEXT NOT NULL,
  webhook_verify_token TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS meta_connections (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  whatsapp_business_account_id TEXT NOT NULL REFERENCES whatsapp_business_accounts(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  verified_name TEXT,
  messaging_range TEXT,
  country_code TEXT,
  expiration_time INTEGER,
  qrcode TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload TEXT,
  processed INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT DEFAULT '[]',
  metadata TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  contact_id TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  whatsapp_account_id TEXT NOT NULL REFERENCES whatsapp_business_accounts(id) ON DELETE CASCADE,
  external_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'open',
  assignee_id TEXT REFERENCES users(id),
  last_message_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT REFERENCES users(id),
  external_id TEXT UNIQUE,
  direction TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  error_code TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS message_attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  mime_type TEXT NOT NULL,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  sha256 TEXT,
  uploaded_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS message_templates (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  external_id TEXT UNIQUE,
  language TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL DEFAULT 'utility',
  status TEXT NOT NULL DEFAULT 'pending',
  body_text TEXT,
  header_text TEXT,
  footer_text TEXT,
  buttons TEXT,
  variables TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES companies(id) ON DELETE SET NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  changes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL
);
`);

export const db = drizzle(sqlite, { schema });

// ── Seed user testing (maulana@mail.com / insantech02) ───────────────────────
(function seed() {
  const existing = db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, "maulana@mail.com"))
    .limit(1)
    .all();

  if (existing.length > 0) return;

  const now = new Date();
  const [company] = db
    .insert(schema.companies)
    .values({ name: "Insantech", subdomain: "insantech", isActive: true, createdAt: now, updatedAt: now })
    .returning({ id: schema.companies.id })
    .all();

  db.insert(schema.users)
    .values({
      email: "maulana@mail.com",
      passwordHash: hashSync("insantech02", 12),
      name: "Maulana",
      companyId: company.id,
      role: "admin",
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  console.log("[DB] Seed user testing: maulana@mail.com");
})();

export type DB = typeof db;
export type User = typeof schema.users.$inferSelect;
export type Company = typeof schema.companies.$inferSelect;
export type WhatsAppBusinessAccount = typeof schema.whatsappBusinessAccounts.$inferSelect;
export type Contact = typeof schema.contacts.$inferSelect;
export type Conversation = typeof schema.conversations.$inferSelect;
export type Message = typeof schema.messages.$inferSelect;
