import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { metaConnections, whatsappBusinessAccounts } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { assertDb } from "@/lib/db-guard";

async function getSession(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("wa_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;
  return verifySessionToken(sessionCookie);
}

export async function POST(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumberId } = body as { phoneNumberId: string };

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: "phoneNumberId is required" },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existingAccount = await db!
      .select({ id: whatsappBusinessAccounts.id, accountStatus: whatsappBusinessAccounts.accountStatus })
      .from(whatsappBusinessAccounts)
      .where(eq(whatsappBusinessAccounts.phoneNumberId, phoneNumberId))
      .limit(1);

    let accountId: string;

    if (existingAccount.length === 0) {
      // Create new WhatsApp business account
      const [newAccount] = await db!
        .insert(whatsappBusinessAccounts)
        .values({
          companyId: session.companyId,
          phoneNumberId,
          accountStatus: "pending",
        })
        .returning({ id: whatsappBusinessAccounts.id });

      accountId = newAccount.id;
    } else {
      accountId = existingAccount[0].id;
    }

    // Create connection record
    const code = Math.random().toString(36).substring(2, 10);
    const [connection] = await db!
      .insert(metaConnections)
      .values({
        companyId: session.companyId,
        whatsappBusinessAccountId: accountId,
        code,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      {
        message: "WhatsApp connection initiated",
        connectionId: connection.id,
        code,
        status: connection.status,
        qrEndpoint: `/api/whatsapp/qr/${connection.id}`,
        webhookUrl: `/api/webhooks/whatsapp`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Connect WhatsApp error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId is required" },
        { status: 400 }
      );
    }

    await db!
      .update(whatsappBusinessAccounts)
      .set({ accountStatus: "disconnected", updatedAt: new Date() })
      .where(eq(whatsappBusinessAccounts.id, accountId));

    return NextResponse.json({ message: "WhatsApp disconnected" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
