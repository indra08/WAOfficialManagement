# PRD — Cloudflare-First Multi-Tenant WhatsApp Business Platform

**Version:** 2.0
**Architecture:** Cloudflare-First / Serverless
**Deployment Target:** Cloudflare Workers
**Database:** Cloudflare D1
**Object Storage:** Cloudflare R2
**Queue:** Cloudflare Queues
**Cache / Configuration:** Cloudflare KV
**Realtime / Stateful Processing:** Cloudflare Durable Objects
**Frontend:** Next.js + TypeScript
**ORM:** Drizzle ORM
**External Integration:** Meta WhatsApp Business Platform / Cloud API

---

# 1. Product Definition

Platform ini adalah aplikasi SaaS multi-tenant yang memungkinkan perusahaan/client menghubungkan WhatsApp Business mereka sendiri melalui Meta dan kemudian mengelola WhatsApp dari aplikasi.

Platform dirancang sejak awal untuk berjalan di **Cloudflare serverless infrastructure**.

Production application tidak membutuhkan:

* VPS
* Docker server
* Nginx
* PHP-FPM
* Laravel
* Redis server
* PostgreSQL server

---

# 2. Architecture Principle

Prioritas arsitektur:

```text
Cloudflare-native
        ↓
Serverless
        ↓
Stateless Application
        ↓
Event-driven Processing
        ↓
Multi-tenant
        ↓
Secure by Default
```

---

# 3. Cloudflare Services

## 3.1 Cloudflare Workers

Digunakan sebagai application runtime.

Responsibilities:

* Next.js application
* API
* Authentication
* Meta integration
* Embedded Signup callback
* Webhook endpoint
* Business logic

---

# 3.2 Cloudflare D1

D1 digunakan sebagai primary relational database untuk MVP.

Digunakan untuk:

* Users
* Companies
* Meta Business
* WABA
* Phone Numbers
* Contacts
* Conversations
* Messages
* Templates
* Audit logs
* Subscription
* System configuration

Database:

```text
Cloudflare Worker
       ↓
Drizzle ORM
       ↓
Cloudflare D1
```

---

# 3.3 Cloudflare R2

Digunakan untuk object storage.

Menyimpan:

* Images
* Documents
* Audio
* Video
* Attachments
* Export files

Database hanya menyimpan metadata.

---

# 3.4 Cloudflare Queues

Digunakan untuk asynchronous processing.

Use cases:

```text
WhatsApp Webhook
       ↓
Queue
       ↓
Consumer Worker
```

Digunakan untuk:

* Incoming message processing
* Outgoing message processing
* Template synchronization
* Media processing
* Retry
* Notification
* Background jobs

---

# 3.5 Cloudflare KV

KV digunakan untuk data ringan yang tidak memerlukan relational query.

Contoh:

```text
configuration
feature_flags
temporary_state
rate_limit_metadata
cached_meta_data
```

KV bukan database utama.

---

# 3.6 Cloudflare Durable Objects

Durable Objects digunakan hanya apabila diperlukan untuk stateful/realtime workloads.

Contoh:

```text
Conversation
     ↓
Durable Object
     ↓
Connected operators
```

Use cases:

* Realtime conversation
* Message ordering
* Per-conversation state
* WebSocket
* Operator presence

Durable Objects tidak digunakan untuk seluruh database.

---

# 3.7 Cloudflare Cron Triggers

Digunakan untuk scheduled jobs.

Contoh:

```text
Every 15 minutes
       ↓
Sync WhatsApp status

Every 1 hour
       ↓
Sync templates

Every day
       ↓
Generate usage statistics
```

---

# 3.8 Cloudflare Secrets

Digunakan untuk:

```text
META_APP_SECRET
META_WEBHOOK_VERIFY_TOKEN
SESSION_SECRET
ENCRYPTION_KEY
```

Secret tidak disimpan di source code.

---

# 4. Technology Stack

## Frontend

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
```

---

## Backend

```text
Cloudflare Workers
Next.js Route Handlers
TypeScript
```

---

## Database

```text
Cloudflare D1
SQLite-compatible
```

ORM:

```text
Drizzle ORM
```

---

## Storage

```text
Cloudflare R2
```

---

## Queue

```text
Cloudflare Queues
```

---

## Cache / KV

```text
Cloudflare KV
```

---

## Realtime

```text
Cloudflare Durable Objects
WebSocket
```

---

# 5. High-Level Architecture

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │ Cloudflare    │
                    │ DNS / WAF     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Cloudflare    │
                    │ Workers       │
                    │               │
                    │ Next.js       │
                    │ API           │
                    └───────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
         D1                KV                 R2
          │                 │                  │
          │                 │                  │
          └────────────┬────┴──────────┬───────┘
                       │               │
                       ▼               ▼
                    Queues       Durable Objects
                       │               │
                       ▼               ▼
                 Worker Consumer   Realtime
                       │
                       ▼
                  Meta WhatsApp
                       │
                       ▼
                    WhatsApp
```

---

# 6. Multi-Tenant Architecture

Setiap company merupakan tenant.

```text
Platform
│
├── Company A
│   ├── Users
│   ├── WABA
│   ├── Phone
│   ├── Contacts
│   ├── Conversations
│   └── Messages
│
├── Company B
│   ├── Users
│   ├── WABA
│   ├── Phone
│   ├── Contacts
│   ├── Conversations
│   └── Messages
│
└── Company C
    ├── Users
    ├── WABA
    ├── Phone
    ├── Contacts
    ├── Conversations
    └── Messages
```

Semua data tenant diisolasi menggunakan `company_id`.

---

# 7. Database

D1 menggunakan SQLite-compatible SQL.

Primary key:

```text
TEXT UUID
```

atau:

```text
INTEGER
```

Rekomendasi:

```text
TEXT UUID
```

karena lebih mudah digunakan dalam distributed/serverless environment.

---

# 8. Database Schema

## companies

```sql
id TEXT PRIMARY KEY
name TEXT NOT NULL
country TEXT
business_email TEXT
website TEXT
status TEXT NOT NULL
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## users

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
name TEXT NOT NULL
email TEXT NOT NULL UNIQUE
password_hash TEXT
role TEXT NOT NULL
email_verified_at INTEGER
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

Index:

```text
users_company_id_idx
users_email_idx
```

---

## meta_businesses

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
meta_business_id TEXT NOT NULL
business_name TEXT
status TEXT
metadata TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## whatsapp_business_accounts

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
meta_business_id TEXT
waba_id TEXT NOT NULL
name TEXT
status TEXT
metadata TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## whatsapp_phone_numbers

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
waba_id TEXT NOT NULL
phone_number_id TEXT NOT NULL
phone_number TEXT
display_name TEXT
verified_name TEXT
status TEXT
quality_rating TEXT
metadata TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## meta_connections

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
meta_user_id TEXT
access_token_encrypted TEXT
token_expires_at INTEGER
status TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## webhook_events

```sql
id TEXT PRIMARY KEY
company_id TEXT
waba_id TEXT
phone_number_id TEXT
event_type TEXT
payload TEXT NOT NULL
processing_status TEXT NOT NULL
processed_at INTEGER
error_message TEXT
created_at INTEGER NOT NULL
```

---

## contacts

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
phone_number TEXT NOT NULL
name TEXT
profile_name TEXT
metadata TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## conversations

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
phone_number_id TEXT NOT NULL
contact_id TEXT NOT NULL
status TEXT NOT NULL
assigned_user_id TEXT
last_message_at INTEGER
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## messages

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
conversation_id TEXT NOT NULL
phone_number_id TEXT NOT NULL
contact_id TEXT NOT NULL
direction TEXT NOT NULL
message_type TEXT NOT NULL
meta_message_id TEXT
status TEXT
body TEXT
payload TEXT
sent_at INTEGER
delivered_at INTEGER
read_at INTEGER
created_at INTEGER NOT NULL
```

Unique:

```text
meta_message_id
```

jika tersedia dan applicable.

---

## message_attachments

```sql
id TEXT PRIMARY KEY
message_id TEXT NOT NULL
r2_key TEXT NOT NULL
file_name TEXT
mime_type TEXT
file_size INTEGER
meta_media_id TEXT
created_at INTEGER NOT NULL
```

---

## message_templates

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
waba_id TEXT NOT NULL
meta_template_id TEXT
name TEXT NOT NULL
language TEXT
category TEXT
status TEXT
components TEXT
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## audit_logs

```sql
id TEXT PRIMARY KEY
company_id TEXT
user_id TEXT
action TEXT NOT NULL
resource_type TEXT
resource_id TEXT
ip_address TEXT
user_agent TEXT
metadata TEXT
created_at INTEGER NOT NULL
```

---

## whatsapp_embedded_signups

Simpan state PKCE dan authorization code saat user mengerjakan Embedded Signup flow Meta.

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL
user_id TEXT NOT NULL
state TEXT NOT NULL UNIQUE           -- CSRF token
code_verifier TEXT NOT NULL UNIQUE   -- PKCE verifier
authorization_code TEXT              -- code dari Meta setelah signup selesai
status TEXT NOT NULL DEFAULT 'pending' -- pending | completed | expired
meta_response TEXT                   -- JSON response dari Meta OAuth/token endpoint
error_message TEXT
created_at INTEGER NOT NULL
completed_at INTEGER
```

---

## whatsapp_app_connections

Token permanen setelah Embedded Signup selesai. Satu baris per perusahaan.

```sql
id TEXT PRIMARY KEY
company_id TEXT NOT NULL UNIQUE
access_token TEXT NOT NULL                   -- user access token untuk Cloud API
app_access_token TEXT NOT NULL               -- app-level token
business_account_id TEXT                     -- WABA ID
phone_number_id TEXT                         -- nomor WA ID
phone_nr TEXT                                -- tampilan nomor (+62...)
account_status TEXT NOT NULL DEFAULT 'inactive' -- inactive | active | pending_review | disabled
quality_rating TEXT                          -- GREEN | YELLOW | RED
tier TEXT                                    -- TIER_500, TIER_1K, dst.
webhook_verified_at INTEGER
last_synced_at INTEGER
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

# 9. JSON Storage

D1 tidak memiliki PostgreSQL-style JSONB.

Untuk data Meta yang fleksibel gunakan:

```text
TEXT
```

dengan JSON serialization.

Contoh:

```json
{
  "raw_status": "CONNECTED",
  "quality": "GREEN",
  "verified_name": "ABC Company"
}
```

Application layer menggunakan:

```text
JSON.stringify()
JSON.parse()
```

---

# 10. Data Retention

Webhook raw payload tidak disimpan selamanya tanpa batas.

Recommended:

```text
Webhook raw event:
30–90 days
```

Setelah retention:

```text
Archive
atau
Delete
```

Message history mengikuti subscription/client policy.

---

# 11. Meta Embedded Signup

Core onboarding menggunakan Meta Embedded Signup.

Flow:

```text
Client
  ↓
Platform
  ↓
Connect WhatsApp
  ↓
Meta Embedded Signup
  ↓
Business
  ↓
WABA
  ↓
Phone
  ↓
Verification
  ↓
Callback
  ↓
Platform
```

---

# 12. Client Requirements

Client harus menyiapkan:

```text
1. Meta/Facebook account
2. Business access
3. Business information
4. Company name
5. Company address
6. Business email
7. Website jika tersedia/diperlukan
8. WhatsApp phone number
9. Access ke nomor tersebut
10. Kemampuan menerima SMS/call verification
11. Dokumen bisnis jika diminta Meta
```

---

# 13. Client Responsibilities

Client melakukan sendiri:

```text
Login Meta
Select Business
Select/Create WABA
Select/Add Phone Number
Verify Phone
Approve authorization
Complete Meta onboarding
```

Platform tidak meminta:

```text
Meta password
OTP
WhatsApp password
Access token
```

---

# 14. Platform Responsibilities

Platform melakukan:

```text
Create company
Launch Embedded Signup
Handle callback
Store Meta identifiers
Manage connection
Configure webhook
Synchronize WABA
Synchronize phone number
Synchronize templates
Receive messages
Send messages
Store message history
```

---

# 15. Client Onboarding UX

## Step 1

```text
Register
```

---

## Step 2

```text
Create Company
```

---

## Step 3

```text
Connect WhatsApp
```

---

## Step 4

```text
Continue with Meta
```

---

## Step 5

Client menyelesaikan proses Meta.

---

## Step 6

Platform menampilkan:

```text
WhatsApp Connected

Business:
ABC Company

Phone:
+62 XXXXXXXX

Status:
● Ready
```

---

# 16. Webhook Architecture

Webhook endpoint:

```text
POST /api/webhooks/whatsapp
```

Flow:

```text
Meta
 ↓
Cloudflare Worker
 ↓
Validate request
 ↓
Identify phone_number_id
 ↓
Identify company
 ↓
Store event in D1
 ↓
Push to Queue
 ↓
Return 200
```

Consumer:

```text
Queue
 ↓
Worker Consumer
 ↓
Process event
 ↓
Update D1
 ↓
Optional R2
 ↓
Optional Durable Object
```

---

# 17. Webhook Processing

Webhook event harus idempotent.

Flow:

```text
Receive event
 ↓
Generate event identifier
 ↓
Check duplicate
 ↓
If duplicate:
    ignore/reconcile
 ↓
If new:
    save
    process
```

---

# 18. Queue Architecture

Queue:

```text
whatsapp-webhook
```

Consumer:

```text
webhook-consumer
```

Optional queues:

```text
whatsapp-outbound
whatsapp-sync
media-processing
notifications
```

---

# 19. Outbound Message

Flow:

```text
Operator
 ↓
Dashboard
 ↓
API
 ↓
Validate tenant
 ↓
Validate WhatsApp
 ↓
Queue
 ↓
Worker
 ↓
Meta API
 ↓
WhatsApp
```

Message ID dari Meta disimpan ke D1.

---

# 20. Incoming Message

Flow:

```text
Customer
 ↓
WhatsApp
 ↓
Meta
 ↓
Webhook
 ↓
Cloudflare Worker
 ↓
D1
 ↓
Queue
 ↓
Consumer
 ↓
Conversation
 ↓
Realtime
 ↓
Operator Dashboard
```

---

# 21. Realtime

Jika realtime diperlukan:

```text
Message
 ↓
Queue Consumer
 ↓
Durable Object
 ↓
WebSocket
 ↓
Dashboard
```

Operator dapat melihat:

```text
New message received
```

tanpa refresh browser.

---

# 22. R2 Media Flow

Incoming media:

```text
WhatsApp
 ↓
Meta
 ↓
Webhook
 ↓
Media ID
 ↓
Worker
 ↓
Meta Media API
 ↓
R2
 ↓
D1 metadata
```

Database menyimpan:

```text
r2_key
mime_type
size
media_id
```

File disimpan di R2.

---

# 23. KV Usage

KV tidak boleh digunakan sebagai primary database.

Digunakan untuk:

```text
Feature flags
Configuration cache
Temporary metadata
Cached API responses
Rate limit support
```

Contoh:

```text
kv:
meta:waba:{waba_id}:status
```

TTL:

```text
5 minutes
```

---

# 24. Durable Objects Usage

Durable Objects hanya digunakan untuk state yang memang membutuhkan consistency dan realtime.

Contoh:

```text
Conversation DO
```

Identifier:

```text
company_id + conversation_id
```

Responsibilities:

```text
Connection tracking
WebSocket
Message ordering
Operator presence
Realtime broadcast
```

---

# 25. Cron Jobs

Cron:

```text
*/15 * * *
```

Digunakan untuk health check.

Cron:

```text
0 * * *
```

Digunakan untuk synchronization.

Cron:

```text
0 0 * * *
```

Digunakan untuk:

```text
Usage aggregation
Cleanup
Retention
Statistics
```

---

# 26. Authentication

Authentication:

```text
Email
Password
Session
Email verification
Password reset
```

Session tidak disimpan di browser sebagai sensitive raw credential.

Recommended:

```text
Secure HttpOnly Cookie
```

---

# 27. Authorization

RBAC:

```text
OWNER
ADMIN
OPERATOR
```

Permission example:

```text
OWNER
├── company
├── billing
├── whatsapp
├── users
└── messages

ADMIN
├── whatsapp
├── users
└── messages

OPERATOR
└── messages
```

---

# 28. Tenant Security

Setiap request harus melewati:

```text
Authentication
        ↓
Authorization
        ↓
Tenant resolution
        ↓
Database query
```

Tidak boleh:

```text
GET /api/messages
```

mengambil seluruh tenant.

Query harus selalu scoped:

```text
WHERE company_id = current_company_id
```

---

# 29. Encryption

Sensitive data:

```text
Meta access token
```

harus dienkripsi.

Encryption key disimpan menggunakan Cloudflare secret.

Tidak boleh:

```text
DATABASE
    access_token plaintext
```

---

# 30. Logging Security

Tidak boleh log:

```text
Password
OTP
Access Token
App Secret
Session Secret
Encryption Key
```

Log hanya:

```text
company_id
request_id
event
status
duration
error_code
```

---

# 31. API

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Company

```text
GET /api/company
POST /api/company
PATCH /api/company
```

---

## WhatsApp

### Embedded Signup Flow

User klik "Connect Account" → backend generate Meta signup URL dengan PKCE → user redirected ke Meta → Meta callback ke backend → backend tukar code → simpan tokens.

```text
POST   /api/whatsapp/embedded         Generate Meta signup URL (PKCE)
GET    /api/whatsapp/embedded/callback  Meta OAuth callback — save tokens
GET    /api/whatsapp/app              Fetch WABA details from Meta API
GET    /api/whatsapp/status           Current connection state (DB only)
DELETE /api/whatsapp/connect          Disconnect and revoke token
```

### Webhooks

```text
GET    /api/webhooks/whatsapp         Challenge verification (Meta requires GET with hub.challenge)
POST   /api/webhooks/whatsapp         Receive messaging events from Meta
```

---

## Templates

```text
GET /api/whatsapp/templates
POST /api/whatsapp/templates/sync
```

---

## Conversations

```text
GET /api/conversations
GET /api/conversations/:id
GET /api/conversations/:id/messages
```

---

## Messages

```text
POST /api/messages
```

---

## Webhook

```text
GET /api/webhooks/whatsapp
POST /api/webhooks/whatsapp
```

---

# 32. Admin API

```text
GET /api/admin/companies
GET /api/admin/companies/:id
GET /api/admin/webhooks
GET /api/admin/audit-logs
GET /api/admin/system-health
```

---

# 33. Dashboard

Dashboard company:

```text
WhatsApp Status
Phone Number
WABA
Messages Today
Unread Messages
Open Conversations
Templates
Webhook Health
```

---

# 34. Admin Dashboard

Admin:

```text
Total Companies
Connected WhatsApp
Pending Onboarding
Failed Onboarding
Webhook Errors
Message Volume
Queue Status
System Health
```

---

# 35. Onboarding State Machine

```text
NOT_STARTED
      ↓
STARTED
      ↓
META_AUTHORIZED
      ↓
BUSINESS_CONNECTED
      ↓
WABA_CONNECTED
      ↓
PHONE_CONNECTED
      ↓
PHONE_VERIFIED
      ↓
WEBHOOK_CONNECTED
      ↓
READY
```

Failure:

```text
FAILED
```

Retry:

```text
FAILED
 ↓
RETRY
 ↓
previous successful state
```

---

# 36. Error Handling

Error harus memiliki:

```text
error_code
message
step
retryable
timestamp
request_id
```

Contoh:

```text
WHATSAPP_PHONE_VERIFICATION_FAILED
```

---

# 37. Queue Retry

Recommended:

```text
Attempt 1
 ↓
Retry
 ↓
Attempt 2
 ↓
Retry
 ↓
Attempt 3
 ↓
Dead Letter Queue
```

Tidak boleh infinite retry.

---

# 38. D1 Indexing

Index wajib pada:

```text
company_id
waba_id
phone_number_id
conversation_id
contact_id
meta_message_id
created_at
status
```

Contoh:

```sql
CREATE INDEX idx_messages_company
ON messages(company_id);

CREATE INDEX idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX idx_messages_meta_id
ON messages(meta_message_id);
```

---

# 39. D1 Transaction

Untuk operasi yang membutuhkan atomicity:

```text
D1 transaction
```

Contoh:

```text
Create company
+
Create owner
```

atau:

```text
Create message
+
Update conversation
```

Jika operasi dapat dilakukan asynchronous, gunakan Queue.

---

# 40. Performance Principle

Jangan melakukan:

```text
Webhook
 ↓
10 API calls
 ↓
Heavy processing
 ↓
Response
```

Sebaliknya:

```text
Webhook
 ↓
Validate
 ↓
Persist event
 ↓
Queue
 ↓
HTTP 200
```

Processing dilakukan asynchronous.

---

# 41. Cloudflare Resource Binding

Worker environment akan mempunyai bindings seperti:

```text
DB
R2
KV
QUEUE
DURABLE_OBJECT
```

Contoh conceptual:

```text
env.DB
env.MEDIA_BUCKET
env.CONFIG
env.WHATSAPP_QUEUE
env.CONVERSATION_DO
```

---

# 42. Wrangler Configuration

Conceptual configuration:

```text
name = "whatsapp-platform"

compatibility_date = "YYYY-MM-DD"

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "whatsapp-platform"
database_id = "..."

[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "whatsapp-platform-media"

[[kv_namespaces]]
binding = "CONFIG"
id = "..."

[[queues.producers]]
binding = "WHATSAPP_QUEUE"
queue = "whatsapp-webhook"

[[queues.consumers]]
queue = "whatsapp-webhook"

[durable_objects]
bindings = [
  { name = "CONVERSATION_DO", class_name = "ConversationDO" }
]
```

Actual syntax harus disesuaikan dengan versi Wrangler yang digunakan saat implementasi.

---

# 43. Environment

## Local

```text
Next.js
Wrangler
Local D1
Local R2 simulation
Local Queue simulation
```

---

## Staging

```text
Cloudflare Workers
D1 staging
R2 staging
Queues staging
Meta test configuration
```

---

## Production

```text
Cloudflare Workers
D1 production
R2 production
Queues production
Meta production
```

---

# 44. Development Requirements

Developer menyiapkan:

```text
Node.js
npm/pnpm
Git
Wrangler
Cloudflare account
Meta Developer account
```

---

# 45. Client Requirements

Client menyiapkan:

```text
Meta account
Business access
Business information
WhatsApp number
Access to verification method
Email
Website if applicable
Business documents if requested
```

---

# 46. Platform Owner Requirements

Platform owner harus menyiapkan:

```text
Cloudflare account
Domain
Cloudflare Worker
D1 database
R2 bucket
KV namespace
Queue
Durable Object if required
Meta Developer App
Meta configuration
Webhook configuration
Secrets
```

---

# 47. Meta Developer Requirements

Platform owner perlu melakukan konfigurasi Meta sesuai requirement Meta saat implementasi, termasuk:

```text
Meta Developer App
WhatsApp product
Embedded Signup configuration
Webhook
Required permissions
App Review
Advanced Access where required
Production configuration
```

### Step-by-step setup Meta App

1. **Create App** — `developers.facebook.com` → My Apps → Create App → tipe **Business**
2. **Tambah Product WhatsApp** — dashboard app → WhatsApp → Set Up
3. **Isi Embedded Signup URLs** — WhatsApp → Configuration → tambah callback URL:
   - Local: `http://localhost:3000/api/whatsapp/embedded/callback`
   - Production: `https://your-domain.com/api/whatsapp/embedded/callback`
4. **Salin kredensial** — Settings → Basic → App ID + App Secret
5. **Isi .env.local** — ikuti panduan di section Environment Variables
6. **Setup Webhook** — WhatsApp → Webhooks → subscribe field `messages`, masukkan `WEBHOOK_BASE_URL/api/webhooks/whatsapp`
7. **Submit untuk review** — setelah semua konfigurasi siap, kirim app ke review Meta

---

# 48. Client Flow Summary

Client hanya perlu:

```text
1. Register platform

2. Create company

3. Klik Connect WhatsApp

4. Login/authorize melalui Meta

5. Pilih business

6. Pilih/create WABA

7. Tambahkan nomor

8. Verifikasi nomor

9. Selesaikan onboarding Meta

10. Kembali ke platform

11. WhatsApp Ready
```

---

# 49. What Platform Does Automatically

```text
Receive Meta callback
        ↓
Identify WABA
        ↓
Identify phone
        ↓
Store configuration
        ↓
Configure webhook
        ↓
Synchronize data
        ↓
Store connection
        ↓
Monitor status
```

Client tidak perlu melakukan konfigurasi server.

---

# 50. Cost-Oriented Architecture

Target MVP menggunakan Cloudflare Free/available free tier sebanyak mungkin.

```text
Next.js
        FREE

Workers
        FREE tier

D1
        FREE tier

R2
        FREE allowance

Queues
        FREE tier

KV
        FREE tier

Durable Objects
        FREE/paid depending on usage

GitHub
        FREE
```

External:

```text
Meta WhatsApp
        pricing according to Meta

Domain
        normally paid
```

Free tier limits harus diperiksa kembali saat deployment karena Cloudflare dapat mengubah batas dan pricing.

---

# 51. What Is NOT Required

Production MVP tidak membutuhkan:

```text
Laravel
PHP
Nginx
Docker
VPS
PostgreSQL
Redis
Kubernetes
RabbitMQ
Kafka
```

---

# 52. Recommended MVP

MVP:

```text
Next.js
TypeScript
Cloudflare Workers
D1
Drizzle
R2
Queues
KV
Meta WhatsApp Cloud API
```

Durable Objects:

```text
Optional
```

Gunakan hanya ketika realtime/stateful requirement sudah diperlukan.

---

# 53. MVP Phase 1

```text
[ ] Project initialization
[ ] Cloudflare configuration
[ ] Next.js
[ ] Authentication
[ ] Company
[ ] User
[ ] RBAC
[ ] D1 schema
[ ] Drizzle migrations
```

---

# 54. MVP Phase 2

```text
[ ] Meta Developer App
[ ] Embedded Signup
[ ] OAuth/callback
[ ] WABA
[ ] Phone Number
[ ] Token encryption
[ ] Connection status
```

---

# 55. MVP Phase 3

```text
[ ] Webhook
[ ] Queue
[ ] Consumer
[ ] Message storage
[ ] Contact
[ ] Conversation
[ ] Message status
```

---

# 56. MVP Phase 4

```text
[ ] Message sending
[ ] Templates
[ ] Media
[ ] R2
[ ] Basic conversation UI
```

---

# 57. MVP Phase 5

```text
[ ] Admin dashboard
[ ] Audit logs
[ ] Monitoring
[ ] Error handling
[ ] Tenant isolation testing
[ ] Security testing
```

---

# 58. Future

Setelah MVP stabil:

```text
AI Chatbot
CRM
Campaign
Broadcast
Automation
Ticketing
Analytics
Billing
White Label
API Marketplace
Omnichannel
```

---

# 59. Acceptance Criteria

MVP berhasil jika:

```text
✓ User dapat register
✓ User dapat create company
✓ User dapat connect Meta
✓ Embedded Signup berjalan
✓ WABA dapat terhubung
✓ Phone number dapat terhubung
✓ Webhook berhasil diverifikasi
✓ Webhook diterima
✓ Event masuk Queue
✓ Event diproses
✓ Message tersimpan
✓ Message dapat dikirim
✓ Message status diperbarui
✓ Media dapat disimpan R2
✓ Data tenant terisolasi
✓ Application berjalan di Cloudflare Workers
```

---

# 60. Final Architecture

```text
                         CLOUDFLARE
┌──────────────────────────────────────────────────────┐
│                                                      │
│                     DNS / WAF                        │
│                         │                            │
│                         ▼                            │
│                    Workers                           │
│                         │                            │
│              ┌──────────┼───────────┐               │
│              │          │           │               │
│              ▼          ▼           ▼               │
│             D1         KV          R2               │
│              │                                      │
│              │                                      │
│              ▼                                      │
│           Queues                                    │
│              │                                      │
│              ▼                                      │
│        Consumer Worker                              │
│              │                                      │
│              ▼                                      │
│       Durable Objects                               │
│              │                                      │
└──────────────┼───────────────────────────────────────┘
               │
               ▼
       META WHATSAPP API
               │
               ▼
           WHATSAPP
               │
               ▼
           CUSTOMER
```

---

# 61. Final Stack

```text
Frontend
    Next.js
    TypeScript
    Tailwind
    shadcn/ui

Runtime
    Cloudflare Workers

Database
    Cloudflare D1

ORM
    Drizzle ORM

Storage
    Cloudflare R2

Queue
    Cloudflare Queues

Cache / Config
    Cloudflare KV

Realtime
    Durable Objects

Scheduler
    Cron Triggers

Security
    Cloudflare Secrets
    WAF
    Rate Limiting

Monitoring
    Cloudflare Observability
    Optional Sentry

External
    Meta WhatsApp Business Platform
```

---

# 62. Architecture Decision

Untuk MVP:

```text
Cloudflare-first
+
D1-first
+
Queue-driven
+
Multi-tenant
+
Meta Embedded Signup
```

Tidak ada dependency terhadap:

```text
VPS
PostgreSQL
Redis
Laravel
Docker
```

Production application harus dapat di-deploy menggunakan Cloudflare Workers dan resource Cloudflare terkait.

Create by https://indramaulana.web.id
Supported by https://insantech-id.web.app
# END OF PRD