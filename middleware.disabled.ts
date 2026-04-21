// Deprecated: Next.js proxy convention uses `proxy.ts` instead of `middleware.ts`.
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedFromNextRequestCookies } from "./proxy";

export function middleware(req: NextRequest) {
  if (!isAuthenticatedFromNextRequestCookies(req.cookies)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*"],
};
