import { SignJWT, jwtVerify } from "jose";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

export interface SessionPayload {
  userId: string;
  companyId: string;
  role: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars"
);

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcryptHash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptCompare(password, hash);
}

export function createSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `wa_session=${token}; Max-Age=${SESSION_MAX_AGE}; HttpOnly; SameSite=Lax${secure}; Path=/`;
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `wa_session=; Max-Age=0; HttpOnly; SameSite=Lax${secure}; Path=/`;
}
