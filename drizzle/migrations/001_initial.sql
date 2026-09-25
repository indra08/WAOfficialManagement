-- Drizzle migration for Cloudflare D1
-- Run with: npx wrangler d1 execute whatsappofficial --file=drizzle/migrations/001_initial.sql

CREATE TABLE IF NOT EXISTS "plans" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL UNIQUE,
  "price" INTEGER NOT NULL,
  "max_companies" INTEGER NOT NULL DEFAULT 1,
  "max_whatsapp_accounts" INTEGER NOT NULL DEFAULT 1,
  "max_contacts" INTEGER NOT NULL DEFAULT 1000,
  "max_team_members" INTEGER NOT NULL DEFAULT 3,
  "features" TEXT DEFAULT '[]',
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "companies" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "subdomain" TEXT NOT NULL UNIQUE,
  "plan_id" TEXT,
  "subscription_id" TEXT,
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "settings" TEXT DEFAULT '{}',
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "company_id" TEXT REFERENCES companies(id) ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'member',
  "is_verified" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "plan_id" TEXT NOT NULL REFERENCES plans(id),
  "status" TEXT NOT NULL DEFAULT 'active',
  "current_period_start" INTEGER,
  "current_period_end" INTEGER,
  "cancel_at_period_end" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "whatsapp_phone_numbers" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "phone_number" TEXT NOT NULL UNIQUE,
  "display_name" TEXT,
  "auth_token" TEXT NOT NULL,
  "webhook_verify_token" TEXT,
  "is_verified" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "meta_businesses" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "meta_business_account_id" TEXT NOT NULL UNIQUE,
  "business_name" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "access_token" TEXT,
  "access_token_expiry" INTEGER,
  "phone_account_id" TEXT,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "whatsapp_business_accounts" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "phone_number_id" TEXT NOT NULL UNIQUE,
  "account_status" TEXT NOT NULL DEFAULT 'inactive',
  "quality_rating" TEXT,
  "name" TEXT,
  "last_synced_at" INTEGER,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "meta_connections" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "whatsapp_business_account_id" TEXT NOT NULL REFERENCES whatsapp_business_accounts(id) ON DELETE CASCADE,
  "code" TEXT NOT NULL UNIQUE,
  "verified_name" TEXT,
  "messaging_range" TEXT,
  "country_code" TEXT,
  "expiration_time" INTEGER,
  "qrcode" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "whatsapp_app_connections" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  "meta_app_id" TEXT NOT NULL,
  "meta_app_secret" TEXT NOT NULL,
  "webhook_verify_token" TEXT,
  "access_token" TEXT NOT NULL,
  "app_access_token" TEXT,
  "business_account_id" TEXT,
  "phone_number_id" TEXT,
  "phone_number" TEXT,
  "account_status" TEXT NOT NULL DEFAULT 'inactive',
  "quality_rating" TEXT,
  "tier" TEXT,
  "webhook_verified_at" INTEGER,
  "last_synced_at" INTEGER,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "phone_number" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "tags" TEXT DEFAULT '[]',
  "metadata" TEXT,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "contact_id" TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  "whatsapp_account_id" TEXT NOT NULL REFERENCES whatsapp_business_accounts(id) ON DELETE CASCADE,
  "external_id" TEXT UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'open',
  "assignee_id" TEXT REFERENCES users(id),
  "last_message_at" INTEGER,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "conversation_id" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "sender_id" TEXT REFERENCES users(id),
  "external_id" TEXT UNIQUE,
  "direction" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text',
  "content" TEXT,
  "status" TEXT NOT NULL DEFAULT 'sent',
  "error_code" TEXT,
  "metadata" TEXT,
  "created_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "message_attachments" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "message_id" TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  "mime_type" TEXT NOT NULL,
  "file_name" TEXT,
  "file_url" TEXT,
  "file_size" INTEGER,
  "sha256" TEXT,
  "uploaded_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "message_templates" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "external_id" TEXT UNIQUE,
  "language" TEXT NOT NULL DEFAULT 'en',
  "category" TEXT NOT NULL DEFAULT 'utility',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "body_text" TEXT,
  "header_text" TEXT,
  "footer_text" TEXT,
  "buttons" TEXT,
  "variables" TEXT,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "webhook_events" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "event_type" TEXT NOT NULL,
  "payload" TEXT,
  "processed" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "created_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT REFERENCES companies(id) ON DELETE SET NULL,
  "user_id" TEXT REFERENCES users(id) ON DELETE SET NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "changes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "created_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "whatsapp_embedded_signups" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "company_id" TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES users(id),
  "state" TEXT NOT NULL UNIQUE,
  "code_verifier" TEXT NOT NULL UNIQUE,
  "meta_app_id" TEXT NOT NULL,
  "meta_app_secret" TEXT NOT NULL,
  "authorization_code" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "meta_response" TEXT,
  "error_message" TEXT,
  "created_at" INTEGER NOT NULL,
  "completed_at" INTEGER
);
