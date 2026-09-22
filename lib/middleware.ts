import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./auth";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password"];
const API_PUBLIC_PREFIXES = ["/api/auth", "/api/webhooks"];

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split("; ").reduce<Record<string, string>>((acc, c) => {
    const eqIdx = c.indexOf("=");
    if (eqIdx === -1) return acc;
    const key = c.slice(0, eqIdx);
    const val = c.slice(eqIdx + 1);
    acc[key] = val;
    return acc;
  }, {});
}

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isPublicAPI = API_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminPath = pathname.startsWith("/admin");
  const isDashboardPath = pathname.startsWith("/dashboard");

  if (isPublicPage || isPublicAPI) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("wa_session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await verifySessionToken(sessionCookie);
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.headers.set("Set-Cookie", "wa_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/");
      return res;
    }

    if (isAdminPath && session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.headers.set("Set-Cookie", "wa_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/");
    return res;
  }

  return NextResponse.next();
}

export default authMiddleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg)).*)"],
};
