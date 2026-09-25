import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { users, companies } from "@/db/schema";
import { comparePassword, signSessionToken, createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { assertDb } from "@/lib/db-guard";

export async function POST(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const [user] = await useDb()
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const validPassword = await comparePassword(validated.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.companyId) {
      return NextResponse.json(
        { error: "User has no company assigned" },
        { status: 400 }
      );
    }

    const [company] = await useDb()
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .limit(1);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const sessionToken = await signSessionToken({
      userId: user.id,
      companyId: company.id,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.headers.set("Set-Cookie", createSessionCookie(sessionToken));
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).issues },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export const runtime = 'edge';
