/**
 * POST /api/webhooks/whatsapp
 *
 * Menerima event dari Meta Cloud API (messaging events).
 * Menyimpan payload ke webhook_events table untuk diproses lebih lanjut.
 *
 * GET handler: challenge verification dari Meta (wajib).
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { webhookEvents, whatsappAppConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.object || body.object !== "whatsapp_business_account") {
      return NextResponse.json({ message: "Not a WhatsApp webhook" }, { status: 200 });
    }

    const entry = body.entry?.[0];
    if (!entry) {
      return NextResponse.json({ message: "No entry found" }, { status: 200 });
    }

    const changes = entry.changes?.[0];
    if (!changes) {
      return NextResponse.json({ message: "No changes found" }, { status: 200 });
    }

    // Extract phone_number_id from meta field
    const metaField = changes.meta;
    if (!metaField?.phone_number_id) {
      return NextResponse.json({ error: "Missing phone_number_id in meta" }, { status: 400 });
    }

    const phoneNumberId = metaField.phone_number_id;

    // Find which company this phone number belongs to
    const [conn] = await useDb()
      .select({ companyId: whatsappAppConnections.companyId })
      .from(whatsappAppConnections)
      .where(eq(whatsappAppConnections.phoneNumberId, phoneNumberId))
      .limit(1);

    if (!conn) {
      console.warn(`[Webhook] Unknown phone_number_id: ${phoneNumberId}`);
      return NextResponse.json({ message: "Account not found" }, { status: 200 });
    }

    const eventType = changes.field || "unknown";
    await useDb().insert(webhookEvents).values({
      companyId: conn.companyId,
      eventType,
      payload: body as Record<string, unknown>,
      processed: false,
    });

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  // Look up stored webhook token from any active connection (fallback to env)
  let expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!expectedToken) {
    const [conn] = await useDb()
      .select({ token: whatsappAppConnections.webhookVerifyToken })
      .from(whatsappAppConnections)
      .limit(1);
    expectedToken = conn?.token ?? undefined;
  }

  if (!expectedToken) {
    return NextResponse.json({ error: "Webhook verify token not configured" }, { status: 500 });
  }

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Invalid verification token" }, { status: 403 });
}
export const runtime = 'edge';
