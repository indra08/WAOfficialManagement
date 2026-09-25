/**
 * DELETE /api/whatsapp/connect
 *
 * Memutuskan koneksi WhatsApp (hard delete + revoke token via Meta).
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

export async function DELETE(request: NextRequest) {
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
      return NextResponse.json({ error: "Belum ada koneksi WhatsApp" }, { status: 404 });
    }

    // Revoke token at Meta (optional — token will expire anyway)
    if (connection.accessToken) {
      fetch(
        `https://graph.facebook.com/v25.0/${connection.businessAccountId}?access_token=${encodeURIComponent(connection.accessToken)}&permanent=true`,
        { method: "DELETE" }
      ).catch(() => null); // non-blocking
    }

    await useDb().delete(whatsappAppConnections).where(eq(whatsappAppConnections.id, connection.id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Disconnect] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const runtime = 'edge';
