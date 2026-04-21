import { NextResponse, type NextRequest } from "next/server";

export const AUTH_COOKIES = {
  isAuthenticated: "isAuthenticated",
  accessToken: "accessToken",
  accessTokenHttpOnly: "access_token",
  adminIsAuthenticated: "isAdminAuthenticated",
  adminAccessToken: "adminAccessToken",
} as const;

function getCookieFromHeader(cookieHeader: string, name: string): string | null {
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (!rawKey) continue;
    if (rawKey === name) {
      const rawValue = rawValueParts.join("=");
      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }
  return null;
}

export function getAuthTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  return (
    getCookieFromHeader(cookieHeader, AUTH_COOKIES.accessTokenHttpOnly) ??
    getCookieFromHeader(cookieHeader, AUTH_COOKIES.accessToken) ??
    null
  );
}

export function isAuthenticatedFromCookieHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const token = getAuthTokenFromCookieHeader(cookieHeader);
  if (token) return true;
  const authFlag = getCookieFromHeader(cookieHeader, AUTH_COOKIES.isAuthenticated);
  return authFlag === "true";
}

export function isAuthenticatedFromRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie");
  return isAuthenticatedFromCookieHeader(cookieHeader);
}

export function isAuthenticatedFromNextRequestCookies(cookies: {
  get(name: string): { value: string } | undefined;
}): boolean {
  const token =
    cookies.get(AUTH_COOKIES.accessTokenHttpOnly)?.value ??
    cookies.get(AUTH_COOKIES.accessToken)?.value ??
    null;
  if (token) return true;
  return cookies.get(AUTH_COOKIES.isAuthenticated)?.value === "true";
}

export function logoutSetCookieHeaders(): string[] {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const base = `Path=/; Expires=${expires}; Max-Age=0`;

  return [
    `${AUTH_COOKIES.isAuthenticated}=; ${base}; SameSite=Lax`,
    `${AUTH_COOKIES.accessToken}=; ${base}; SameSite=Lax`,
    `${AUTH_COOKIES.accessTokenHttpOnly}=; ${base}; SameSite=Strict; HttpOnly; Secure`,
    `${AUTH_COOKIES.adminIsAuthenticated}=; ${base}; SameSite=Lax`,
    `${AUTH_COOKIES.adminAccessToken}=; ${base}; SameSite=Lax`,
  ];
}

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

export default middleware;
