import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { companyCreateSchema } from "@/lib/validation";
import { eq, asc } from "drizzle-orm";
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

    const result = await db!
      .select({
        id: companies.id,
        name: companies.name,
        subdomain: companies.subdomain,
        isActive: companies.isActive,
        createdAt: companies.createdAt,
      })
      .from(companies)
      .orderBy(asc(companies.createdAt));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = companyCreateSchema.parse(body);

    const existing = await db!
      .select()
      .from(companies)
      .where(eq(companies.subdomain, validated.subdomain))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Subdomain already exists" },
        { status: 409 }
      );
    }

    const [company] = await db!
      .insert(companies)
      .values({
        name: validated.name,
        subdomain: validated.subdomain,
        isActive: true,
      })
      .returning();

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).issues },
        { status: 400 }
      );
    }
    console.error("Create company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
