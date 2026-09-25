export { authMiddleware as default } from "@/lib/middleware";
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|gif|svg|webp)).*)"],
};
