import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Next 16: proxy.ts pengganti middleware.ts. Cek cookie saja (optimistic, tanpa
// DB) — otorisasi role yang sesungguhnya ada di src/app/admin/layout.tsx.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
