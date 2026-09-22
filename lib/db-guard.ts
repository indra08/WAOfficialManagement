import { NextResponse } from "next/server";
import { db } from "./db";

export function assertDb(): Promise<NextResponse | null> {
  if (!db) {
    return Promise.resolve(NextResponse.json(
      { error: "Database not configured. Set DATABASE_URL to enable." },
      { status: 503 }
    ));
  }
  return Promise.resolve(null);
}
