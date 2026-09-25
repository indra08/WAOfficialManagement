import { NextResponse } from "next/server";
import { db } from "./db";

export function assertDb(): Promise<NextResponse | null> {
  if (!db) {
    return Promise.resolve(NextResponse.json(
      { error: "Database not configured. Set D1 binding or DATABASE_URL." },
      { status: 503 }
    ));
  }
  return Promise.resolve(null);
}
