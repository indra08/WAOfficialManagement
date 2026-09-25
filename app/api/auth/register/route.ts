import { NextRequest, NextResponse } from "next/server";
import { useDb } from "@/lib/db";
import { users, companies } from "@/db/schema";
import { hashPassword, signSessionToken, createSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { assertDb } from "@/lib/db-guard";

export async function POST(request: NextRequest) {
  const dbErr = await assertDb();
  if (dbErr) return dbErr;
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existingUser = await useDb()
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(validated.password);
    const role = "member";

    const [newUser] = await useDb()
      .insert(users)
      .values({
        email: validated.email,
        passwordHash,
        name: validated.name,
        role,
        isVerified: true,
      })
      .returning({ id: users.id });

    const [company] = await useDb()
      .insert(companies)
      .values({
        name: validated.name + " Company",
        subdomain: validated.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        isActive: true,
      })
      .returning({ id: companies.id });

    await useDb()
      .update(users)
      .set({ companyId: company.id })
      .where(eq(users.id, newUser.id));

    const sessionToken = await signSessionToken({
      userId: newUser.id,
      companyId: company.id,
      role,
    });

    const response = NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );

    response.headers.set("Set-Cookie", createSessionCookie(sessionToken));
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).issues },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export const runtime = 'edge';
