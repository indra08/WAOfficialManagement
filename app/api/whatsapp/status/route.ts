import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { whatsappBusinessAccounts } from "@/db/schema";
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

export async function GET(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await db!
      .select({
        id: whatsappBusinessAccounts.id,
        phoneNumberId: whatsappBusinessAccounts.phoneNumberId,
        accountStatus: whatsappBusinessAccounts.accountStatus,
        qualityRating: whatsappBusinessAccounts.qualityRating,
        name: whatsappBusinessAccounts.name,
        lastSyncedAt: whatsappBusinessAccounts.lastSyncedAt,
        createdAt: whatsappBusinessAccounts.createdAt,
      })
      .from(whatsappBusinessAccounts)
      .where(eq(whatsappBusinessAccounts.companyId, session.companyId))
      .limit(10);

    return NextResponse.json(accounts);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
