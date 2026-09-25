/**
 * GET /api/whatsapp/app
 *
 * Mengambil detail WABA dari Meta API menggunakan access_token yang tersimpan.
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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await useDb(request);
    if (!db) throw new Error("No DB");
    const [conn] = await db
      .select()
      .from(whatsappAppConnections)
      .where(eq(whatsappAppConnections.companyId, session.companyId))
      .limit(1);

    if (!conn) {
      return NextResponse.json({ error: "Belum ada koneksi WhatsApp" }, { status: 404 });
    }

    if (!conn.accessToken) {
      return NextResponse.json({ error: "Access token tidak tersedia" }, { status: 401 });
    }

    // Fetch fresh data from Meta API
    const res = await fetch(
      `https://graph.facebook.com/v25.0/${conn.businessAccountId}?fields=quality_rating,status,messaging_capacity,tier,display_phone_number&access_token=${conn.accessToken}`
    );
    const data = await res.json();

    // Refresh last_synced_at
    await db.update(whatsappAppConnections)
      .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
      .where(eq(whatsappAppConnections.id, conn.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[WhatsApp app] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const runtime = 'edge';
