import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { webhookEvents, whatsappBusinessAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { assertDb } from "@/lib/db-guard";

export async function POST(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const body = await request.json();

    if (!body.object || body.object !== "whatsapp_business_account") {
      return NextResponse.json(
        { error: "Invalid webhook object" },
        { status: 400 }
      );
    }

    const entry = body.entry?.[0];
    if (!entry) {
      return NextResponse.json({ message: "No entry found" }, { status: 200 });
    }

    const changes = entry.changes?.[0];
    if (!changes) {
      return NextResponse.json({ message: "No changes found" }, { status: 200 });
    }

    const metaField = changes.meta;
    if (!metaField) {
      return NextResponse.json({ error: "Missing meta field" }, { status: 400 });
    }

    const phoneNumberId = metaField.phone_number_id;

    const account = await db!
      .select({ id: whatsappBusinessAccounts.id, companyId: whatsappBusinessAccounts.companyId })
      .from(whatsappBusinessAccounts)
      .where(eq(whatsappBusinessAccounts.phoneNumberId, phoneNumberId))
      .limit(1);

    if (account.length === 0) {
      return NextResponse.json(
        { error: "Account not found for phone number" },
        { status: 404 }
      );
    }

    const eventType = changes.field;
    const timestamp = Math.floor(Date.now() / 1000);

    await db!.insert(webhookEvents).values({
      companyId: account[0].companyId,
      eventType,
      payload: body as Record<string, unknown>,
      processed: false,
    });

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({ error: "Invalid verification token" }, { status: 403 });
}
