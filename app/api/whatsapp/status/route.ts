/**
 * GET /api/whatsapp/status
 *
 * Mengembalikan status koneksi WhatsApp perusahaan saat ini.
 * Return: { connected, phoneNumberId, businessAccountId, phoneNr, accountStatus, qualityRating, tier, lastSyncedAt, hasPendingSignup, pendingSignupCreatedAt }
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { whatsappAppConnections, whatsappEmbeddedSignups } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

async function getSession(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionCookie = cookieHeader.split("; ").find((c) => c.startsWith("wa_session="))?.split("=")[1];
  if (!sessionCookie) return null;
  return verifySessionToken(sessionCookie);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [connection] = await useDb()
      .select()
      .from(whatsappAppConnections)
      .where(eq(whatsappAppConnections.companyId, session.companyId))
      .limit(1);

    if (!connection) {
      return NextResponse.json({ connected: false });
    }

    const [pendingSignup] = await useDb()
      .select()
      .from(whatsappEmbeddedSignups)
      .where(and(eq(whatsappEmbeddedSignups.companyId, session.companyId), eq(whatsappEmbeddedSignups.status, "pending")))
      .orderBy(whatsappEmbeddedSignups.createdAt as unknown as SQLiteColumn)
      .limit(1);

    return NextResponse.json({
      connected: connection.accessToken.length > 0,
      phoneNumberId: connection.phoneNumberId ?? null,
      businessAccountId: connection.businessAccountId ?? null,
      phoneNr: connection.phoneNr ?? null,
      accountStatus: connection.accountStatus as "inactive" | "active" | "pending_review" | "disabled",
      qualityRating: connection.qualityRating ?? null,
      tier: connection.tier ?? null,
      lastSyncedAt: connection.lastSyncedAt ? new Date(connection.lastSyncedAt).toISOString() : null,
      hasPendingSignup: !!pendingSignup,
      pendingSignupCreatedAt: pendingSignup ? new Date(pendingSignup.createdAt).toISOString() : null,
    });
  } catch (error) {
    console.error("[WhatsApp status] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const runtime = 'edge';
