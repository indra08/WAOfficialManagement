/**
 * POST /api/whatsapp/test/message
 *
 * Kirim pesan uji (Trial) menggunakan WA Access Token yang tersimpan.
 * Mendukung pesan teks & template sesuai dokumentasi Meta:
 *   https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 */

import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { whatsappAppConnections } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

const WHATSAPP_API_VERSION = "v25.0";

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

    const reqBody = (await request.json()) as { phoneNumber?: string; message?: string | Record<string, unknown>; messageType?: string; };
    const { phoneNumber, message, messageType } = reqBody;

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "Nomor telepon dan pesan wajib diisi." }, { status: 400 });
    }

    const db = await useDb(request);
    if (!db) throw new Error("No DB");
    const [conn] = await db
      .select()
      .from(whatsappAppConnections)
      .where(eq(whatsappAppConnections.companyId, session.companyId))
      .limit(1);

    if (!conn || !conn.accessToken || !conn.phoneNumberId) {
      return NextResponse.json(
        { error: "WhatsApp belum terhubung dengan lengkap. Nomor telepon belum terdeteksi — silakan Connect Account ulang dari dashboard." },
        { status: 403 }
      );
    }

    if (conn.accountStatus === "disabled") {
      return NextResponse.json({ error: "Akun WhatsApp dinonaktifkan. Hubungi Admin Meta." }, { status: 403 });
    }

    // Bangun body sesuai tipe pesan
    const body: Record<string, unknown> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phoneNumber,
    };

    if (messageType === "template") {
      body.type = "template";
      const templateMsg = message as Record<string, unknown>;
      body.template = {
        name: templateMsg.name,
        language: { code: templateMsg.language ?? "id" },
        ...(templateMsg.components && (templateMsg.components as unknown[]).length > 0
          ? { components: templateMsg.components }
          : {}),
      };
    } else {
      body.type = "text";
      body.text = { body: typeof message === "string" ? message : message.body };
    }

    // Panggil Meta Cloud API
    const apiUrl = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${conn.phoneNumberId}/messages`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${conn.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as Record<string, unknown>;

    if (!res.ok || data.error) {
      console.error("[Test message] Meta API error:", data);
      return NextResponse.json(
        { error: (data.error as Record<string, unknown>)?.message ?? "Gagal mengirim pesan", detail: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Test message] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
export const runtime = 'edge';
