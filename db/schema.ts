import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());
const updatedAt = () =>
  integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());

// ── Plans & Subscriptions ─────────────────────────────────────────────────────

export const plans = sqliteTable("plans", {
  id: id(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  price: integer("price").notNull(),
  maxCompanies: integer("max_companies").notNull().default(1),
  maxWhatsAppAccounts: integer("max_whatsapp_accounts").notNull().default(1),
  maxContacts: integer("max_contacts").notNull().default(1000),
  maxTeamMembers: integer("max_team_members").notNull().default(3),
  features: text("features", { mode: "json" }).$type<string[]>().default([]),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  status: text("status").notNull().default("active"),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Core entities ─────────────────────────────────────────────────────────────

export const companies = sqliteTable("companies", {
  id: id(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  planId: text("plan_id"),
  subscriptionId: text("subscription_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  settings: text("settings", { mode: "json" })
    .$type<Record<string, unknown>>()
    .default({}),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  companyId: text("company_id").references(() => companies.id, {
    onDelete: "cascade",
  }),
  role: text("role").notNull().default("member"),
  isVerified: integer("is_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Meta / WhatsApp ───────────────────────────────────────────────────────────

export const metaBusinesses = sqliteTable("meta_businesses", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  metaBusinessAccountId: text("meta_business_account_id").notNull().unique(),
  businessName: text("business_name"),
  status: text("status").notNull().default("pending"),
  accessToken: text("access_token"),
  accessTokenExpiry: integer("access_token_expiry", { mode: "timestamp" }),
  phoneAccountId: text("phone_account_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const whatsappBusinessAccounts = sqliteTable(
  "whatsapp_business_accounts",
  {
    id: id(),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    phoneNumberId: text("phone_number_id").notNull().unique(),
    accountStatus: text("account_status").notNull().default("inactive"),
    qualityRating: text("quality_rating"),
    name: text("name"),
    lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  }
);

export const whatsappPhoneNumbers = sqliteTable("whatsapp_phone_numbers", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number").notNull().unique(),
  displayName: text("display_name"),
  authToken: text("auth_token").notNull(),
  webhookVerifyToken: text("webhook_verify_token"),
  isVerified: integer("is_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const metaConnections = sqliteTable("meta_connections", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  whatsappBusinessAccountId: text("whatsapp_business_account_id")
    .notNull()
    .references(() => whatsappBusinessAccounts.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  verifiedName: text("verified_name"),
  messagingRange: text("messaging_range"),
  countryCode: text("country_code"),
  expirationTime: integer("expiration_time", { mode: "timestamp" }),
  qrcode: text("qrcode"),
  status: text("status").notNull().default("pending"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Messaging ─────────────────────────────────────────────────────────────────

export const webhookEvents = sqliteTable("webhook_events", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>(),
  processed: integer("processed", { mode: "boolean" }).notNull().default(false),
  error: text("error"),
  createdAt: createdAt(),
});

export const contacts = sqliteTable("contacts", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number").notNull(),
  name: text("name"),
  email: text("email"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const conversations = sqliteTable("conversations", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  contactId: text("contact_id").references(() => contacts.id, {
    onDelete: "set null",
  }),
  whatsappAccountId: text("whatsapp_account_id")
    .notNull()
    .references(() => whatsappBusinessAccounts.id, { onDelete: "cascade" }),
  externalId: text("external_id").unique(),
  status: text("status").notNull().default("open"),
  assigneeId: text("assignee_id").references(() => users.id),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const messages = sqliteTable("messages", {
  id: id(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").references(() => users.id),
  externalId: text("external_id").unique(),
  direction: text("direction").notNull(),
  type: text("type").notNull().default("text"),
  content: text("content"),
  status: text("status").notNull().default("sent"),
  errorCode: text("error_code"),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: createdAt(),
});

export const messageAttachments = sqliteTable("message_attachments", {
  id: id(),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  mimeType: text("mime_type").notNull(),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  sha256: text("sha256"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const messageTemplates = sqliteTable("message_templates", {
  id: id(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  externalId: text("external_id").unique(),
  language: text("language").notNull().default("en"),
  category: text("category").notNull().default("utility"),
  status: text("status").notNull().default("pending"),
  bodyText: text("body_text"),
  headerText: text("header_text"),
  footerText: text("footer_text"),
  buttons: text("buttons", { mode: "json" }).$type<
    Array<{ type: string; text: string }>
  >(),
  variables: text("variables", { mode: "json" }).$type<string[]>(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: id(),
  companyId: text("company_id").references(() => companies.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  changes: text("changes", { mode: "json" }).$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: createdAt(),
});
