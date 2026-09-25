/**
 * GET /api/whatsapp/embedded/callback
 *
 * Meta redirect ke sini setelah user menyelesaikan Embedded Signup flow.
 *
 * Flow:
 *   1. Verifikasi state (CSRF protection)
 *   2. Cari record signup di DB — ambil metaAppId + metaAppSecret dari situ
 *   3. Tukar authorization_code → access_token via Meta Token Endpoint
 *   4. Fetch WABA IDs: GET /{app_id}/whatsapp_business_accounts
 *   5. Fetch phone numbers: GET /{waba_id}/whatsapp_phones
 *   6. Fetch WABA details untuk quality rating, status, dll
 *   7. Setup webhook subscription (best-effort)
 *   8. Simpan semua ke whatsapp_app_connections
 *   9. Redirect ke /dashboard/whatsapp
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { whatsappEmbeddedSignups, whatsappAppConnections } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

interface MetaTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  app_access_token?: string;
  waba_id?: string;
  phone_number_id?: string;
  code?: string;
  error?: string;
  error_reason?: string;
  error_message?: string;
}

async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  codeVerifier: string
): Promise<{ ok: boolean; data: MetaTokenResponse; error?: string }> {
  const tokenUrl = "https://graph.facebook.com/v25.0/oauth/access_token";
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const json: MetaTokenResponse = await res.json();
    if (!res.ok || json.error) return { ok: false, data: json };
    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, data: { error: String(err) } };
  }
}

// Buat App Access Token dari App ID + Secret (format standar Meta: {appid}|{appsecret})
// Tidak perlu HTTP call — ini adalah cara resmi yang digunakan di Meta PHP SDK dan dokumentasi mereka.
async function buildAppAccessToken(appId: string, appSecret: string): Promise<string> {
  return `${appId}|${appSecret}`;
}

// Ambil daftar WABA yang milik app ini — perlu App Access Token
async function fetchWabaIds(appAccessToken: string, appId: string): Promise<string[]> {
  const url = new URL(`https://graph.facebook.com/v25.0/${appId}/whatsapp_business_accounts`);
  url.searchParams.set("access_token", appAccessToken);
  try {
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok || json.error) {
      console.warn("[Fetch WABA IDs] error:", json);
      return [];
    }
    return (json.data ?? [])
      .map((item: { id: string }) => item.id)
      .filter(Boolean);
  } catch (err) {
    console.warn("[Fetch WABA IDs via app] exception:", err);
    return [];
  }
}

// Fallback: ambil WABA via user-level endpoint (pakai User Access Token)
async function fetchWabaIdsViaUser(userAccessToken: string): Promise<string[]> {
  const url = new URL("https://graph.facebook.com/v25.0/me/whatsapp_business_accounts");
  url.searchParams.set("access_token", userAccessToken);
  try {
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok || json.error) {
      console.warn("[Fetch WABA IDs via user] error:", JSON.stringify(json).slice(0, 200));
      return [];
    }
    return (json.data ?? [])
      .map((item: { id: string }) => item.id)
      .filter(Boolean);
  } catch (err) {
    console.warn("[Fetch WABA IDs via user] exception:", err);
    return [];
  }
}

// Ambil daftar nomor telepon dari satu WABA
async function fetchPhoneNumbers(accessToken: string, wabaId: string): Promise<Array<{ id: string; number: string }>> {
  const url = new URL(`https://graph.facebook.com/v25.0/${wabaId}/whatsapp_phones`);
  url.searchParams.set("access_token", accessToken);
  try {
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok || json.error) {
      console.warn(`[Fetch Phones for ${wabaId}] error:`, json);
      return [];
    }
    return (json.data ?? []).map((p: { id: string; phone_number: string }) => ({
      id: p.id,
      number: p.phone_number,
    }));
  } catch (err) {
    console.warn(`[Fetch Phones for ${wabaId}] exception:`, err);
    return [];
  }
}

// Ambil detail WABA (status, quality, tier, display phone)
async function fetchWabaDetails(accessToken: string, businessAccountId: string): Promise<Record<string, unknown>> {
  const url = new URL(`https://graph.facebook.com/v25.0/${businessAccountId}`);
  url.searchParams.set("fields", "quality_rating,display_phone_number,status,messaging_capacity,tier");
  url.searchParams.set("access_token", accessToken);
  try {
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok || json.error) {
      console.warn("[Fetch WABA details] error:", json);
      return {};
    }
    return json;
  } catch {
    return {};
  }
}

// Setup webhook subscription
async function setupWebhookSubscription(
  accessToken: string,
  webhookUrl: string,
  phoneNumberId: string
): Promise<void> {
  const subscribeUrl = `https://graph.facebook.com/v25.0/${phoneNumberId}/subscriptions?access_token=${encodeURIComponent(accessToken)}`;
  try {
    const res = await fetch(subscribeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_url: webhookUrl, fields: ["messaging"] }),
    });
    const json = await res.json();
    if (!res.ok || json.error) console.warn("[Webhook setup] failed:", json);
  } catch (err) {
    console.warn("[Webhook setup] error:", err);
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  // Baca dari query string (?code=&state=) — normal PKCE flow
  let code = url.searchParams.get("code");
  let state = url.searchParams.get("state");
  let error = url.searchParams.get("error");
  let errorReason = url.searchParams.get("error_reason");
  let errorMessage = url.searchParams.get("error_message");

  // Fallback: Meta kadang melempar fragment (#access_token=...&code=...)
  // Ini terjadi jika response_type mengandung "token" (Implicit Grant)
  if (!code && url.hash) {
    const hashParams = new URLSearchParams(url.hash.slice(1));
    code = hashParams.get("code");
    state = hashParams.get("state");
    error = hashParams.get("error");
    errorReason = hashParams.get("error_reason");
    errorMessage = hashParams.get("error_message");
  }

  const callbackOrigin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${callbackOrigin}/api/whatsapp/embedded/callback`;
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || callbackOrigin;

  // Meta auth error
  if (error) {
    const reason = errorReason ?? errorMessage ?? error;
    return NextResponse.redirect(new URL(`/dashboard/whatsapp?connectError=${encodeURIComponent(reason)}`, url.origin));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard/whatsapp?connectError=Missing+code+or+state", url.origin));
  }

  try {
    // 1. Find pending signup record
    const [signup] = await useDb()
      .select()
      .from(whatsappEmbeddedSignups)
      .where(eq(whatsappEmbeddedSignups.state, state))
      .orderBy(desc(whatsappEmbeddedSignups.createdAt))
      .limit(1);

    if (!signup) {
      return NextResponse.redirect(new URL("/dashboard/whatsapp?connectError=Signup+session+tidak+ditemukan.+Silakan+coba+lagi.", url.origin));
    }

    if (signup.status !== "pending") {
      return NextResponse.redirect(new URL("/dashboard/whatsapp?connectError=Signup+sudah+digunakan.+Mulai+ulang.", url.origin));
    }

    // 2. Exchange code for tokens
    const { ok, data: tokenData, error: tokenError } = await exchangeCodeForTokens(
      code,
      signup.metaAppId,
      signup.metaAppSecret,
      redirectUri,
      signup.codeVerifier
    );

    if (!ok || !tokenData.access_token) {
      await useDb().update(whatsappEmbeddedSignups)
        .set({ status: "expired", metaResponse: tokenData as unknown as Record<string, unknown>, errorMessage: tokenError ?? "Token exchange failed" })
        .where(eq(whatsappEmbeddedSignups.id, signup.id));
      const reason = tokenData.error_reason || tokenData.error_message || tokenError || "Token exchange failed";
      return NextResponse.redirect(new URL(`/dashboard/whatsapp?connectError=${encodeURIComponent(reason)}`, url.origin));
    }

    const { access_token, app_access_token } = tokenData;

    // 3. Bangun App Access Token dari App ID + Secret (pakai format {appid}|{appsecret})
    const appAccessToken = await buildAppAccessToken(signup.metaAppId, signup.metaAppSecret);

    // 4. Fetch WABA IDs — coba app-level dulu, fallback ke user-level
    const wabaIdsFromApp = await fetchWabaIds(appAccessToken, signup.metaAppId);
    let wabaIds: string[] = wabaIdsFromApp;
    if (wabaIds.length === 0) {
      console.log("[Callback] App endpoint empty, trying user-level fallback...");
      wabaIds = await fetchWabaIdsViaUser(access_token);
    }
    if (wabaIds.length === 0) {
      console.error("[Callback] No WABA found via any method. App ID:", signup.metaAppId);
    }

    // 4. Fetch phone numbers dari WABA pertama
    let phoneNumberId: string | null = null;
    let phoneNumber: string | null = null;
    let wabaDetails: Record<string, unknown> = {};

    if (wabaIds.length > 0) {
      const phones = await fetchPhoneNumbers(access_token, wabaIds[0]);
      if (phones.length > 0) {
        phoneNumberId = phones[0].id;
        phoneNumber = phones[0].number;
      }

      // Fetch WABA details untuk quality/rating/status
      wabaDetails = await fetchWabaDetails(access_token, wabaIds[0]);
    }

    // 6. Setup webhook subscription (best-effort)
    const webhookFullUrl = `${webhookBaseUrl}/api/webhooks/whatsapp`;
    if (app_access_token && phoneNumberId) {
      await setupWebhookSubscription(access_token, webhookFullUrl, phoneNumberId);
    }

    // 6. Upsert connection record
    const qualityRating = (wabaDetails as Record<string, string>).quality_rating ?? null;
    const tier = (wabaDetails as Record<string, string>).tier ?? null;
    const ws = (wabaDetails as Record<string, string>)?.status ?? "inactive";

    await useDb().insert(whatsappAppConnections)
      .values({
        companyId: signup.companyId,
        metaAppId: signup.metaAppId,
        metaAppSecret: signup.metaAppSecret,
        accessToken: access_token,
        appAccessToken: app_access_token ?? "",
        businessAccountId: wabaIds[0] ?? null,
        phoneNumberId,
        phoneNr: phoneNumber,
        accountStatus: ws === "active" ? "active" : ws === "pending_review" ? "pending_review" : "inactive",
        qualityRating,
        tier,
        lastSyncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: whatsappAppConnections.companyId,
        set: {
          metaAppId: signup.metaAppId,
          metaAppSecret: signup.metaAppSecret,
          accessToken: access_token,
          appAccessToken: app_access_token ?? "",
          businessAccountId: wabaIds[0] ?? null,
          phoneNumberId,
          phoneNr: phoneNumber,
          accountStatus: ws === "active" ? "active" : ws === "pending_review" ? "pending_review" : "inactive",
          qualityRating,
          tier,
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        },
      });

    // 7. Mark signup as completed
    await useDb().update(whatsappEmbeddedSignups)
      .set({ status: "completed", authorizationCode: code, metaResponse: tokenData as unknown as Record<string, unknown>, completedAt: new Date() })
      .where(eq(whatsappEmbeddedSignups.id, signup.id));

    // 9. Redirect success
    return NextResponse.redirect(new URL("/dashboard/whatsapp?connected=true", url.origin));
  } catch (error) {
    console.error("[Embedded callback] Error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/whatsapp?connectError=Terjadi+kesalahan+server.+Silakan+coba+lagi.", request.url)
    );
  }
}
export const runtime = 'edge';
