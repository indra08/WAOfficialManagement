import { NextResponse } from "next/server";
import { seed } from "@/lib/db";

// POST /api/seed — jalankan seed user testing (hanya production)
export async function POST() {
  await seed();
  return NextResponse.json({ ok: true });
}
export const runtime = 'edge';
