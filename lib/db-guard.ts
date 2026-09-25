import { NextResponse } from "next/server";
import { useDb } from "./db";

export async function assertDb(): Promise<NextResponse | null> {
  const db = await useDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 }
    );
  }
  return null;
}
