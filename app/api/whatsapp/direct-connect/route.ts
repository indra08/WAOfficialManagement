/**
 * POST /api/whatsapp/direct-connect
 *
 * Simpan kredensial WhatsApp langsung dari input user (tanpa OAuth flow).
 * Cocok untuk local testing atau saat user sudah memiliki access token dari Meta Developer Console.
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { whatsappAppConnections } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

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

    const body = await request.json();
    const { accessToken, phoneNumberId, businessAccountId, phoneNr }: {
      accessToken?: string;
      phoneNumberId?: string;
      businessAccountId?: string;
      phoneNr?: string;
    } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Access Token wajib diisi." }, { status: 400 });
    }

    const now = new Date();

    const [existing] = await useDb()
      .select()
      .from(whatsappAppConnections)
      .where(eq(whatsappAppConnections.companyId, session.companyId))
      .limit(1);

    if (existing) {
      await useDb().update(whatsappAppConnections)
        .set({
          accessToken,
          metaAppId: existing.metaAppId ?? "",
          metaAppSecret: existing.metaAppSecret ?? "",
          phoneNumberId: phoneNumberId ?? existing.phoneNumberId,
          businessAccountId: businessAccountId ?? existing.businessAccountId,
          phoneNr: phoneNr ?? existing.phoneNr,
          lastSyncedAt: now,
          updatedAt: now,
        })
        .where(eq(whatsappAppConnections.companyId, session.companyId));
    } else {
      await useDb().insert(whatsappAppConnections).values({
        companyId: session.companyId,
        metaAppId: "",
        metaAppSecret: "",
        accessToken,
        phoneNumberId: phoneNumberId ?? null,
        businessAccountId: businessAccountId ?? null,
        phoneNr: phoneNr ?? null,
        lastSyncedAt: now,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Direct Connect] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const runtime = 'edge';
