/**
 * POST /api/whatsapp/embedded
 *
 * Membuat record embedded-signup di DB lalu mengembalikan redirect-URL ke Meta.
 *
 * Alur PKCE + per-user credentials:
 *   1. Client mengirim metaAppId + metaAppSecret (kredensial Meta App milik user)
 *   2. Generate code_verifier + code_challenge (PKCE)
 *   3. Simpan state + code_verifier + metaAppId + metaAppSecret di signup record
 *   4. Kembalikan { url } agar client melakukan window.location.href
 *
 * Meta Embedded Signup Docs:
 *   https://developers.facebook.com/docs/whatsapp/business-management-api/embedded-signup
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { whatsappEmbeddedSignups } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";

function bufToBase64url(buf: Uint8Array): string {
  let str = "";
  for (let i = 0; i < buf.length; i++) str += String.fromCharCode(buf[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Base64url(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return bufToBase64url(new Uint8Array(hashBuf));
}

async function generatePkce(): Promise<{ verifier: string; challenge: string }> {
  const verifierBuf = crypto.getRandomValues(new Uint8Array(32));
  const verifier = bufToBase64url(verifierBuf);
  const challenge = await sha256Base64url(verifier);
  return { verifier, challenge };
}

async function getSession(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionCookie = cookieHeader.split("; ").find((c) => c.startsWith("wa_session="))?.split("=")[1];
  if (!sessionCookie) return null;
  return verifySessionToken(sessionCookie);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { metaAppId, metaAppSecret }: { metaAppId?: string; metaAppSecret?: string } = await request.json();

    if (!metaAppId || !metaAppSecret) {
      return NextResponse.json({ error: "metaAppId dan metaAppSecret wajib diisi." }, { status: 400 });
    }

    const callbackOrigin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${callbackOrigin}/api/whatsapp/embedded/callback`;

    const { verifier, challenge } = await generatePkce();
    const stateBuf = crypto.getRandomValues(new Uint8Array(16));
    const state = bufToBase64url(stateBuf);

    const [record] = await useDb()
      .insert(whatsappEmbeddedSignups)
      .values({
        companyId: session.companyId,
        userId: session.userId,
        state,
        codeVerifier: verifier,
        metaAppId,
        metaAppSecret,
        status: "pending",
      })
      .returning({ id: whatsappEmbeddedSignups.id });

    const metaUrl = new URL("https://www.facebook.com/v25.0/dialog/oauth");
    metaUrl.searchParams.set("client_id", metaAppId);
    metaUrl.searchParams.set("redirect_uri", redirectUri);
    metaUrl.searchParams.set("response_type", "code");
    metaUrl.searchParams.set("scope", "whatsapp_business_management whatsapp_business_messaging");
    metaUrl.searchParams.set("state", state);
    metaUrl.searchParams.set("code_challenge", challenge);
    metaUrl.searchParams.set("code_challenge_method", "S256");

    return NextResponse.json({ url: metaUrl.toString(), signupId: record.id });
  } catch (error) {
    console.error("[Embedded signup] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const runtime = 'edge';
