import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const allCookies = request.cookies.getAll();

    const getCookieValue = (name: string) => request.cookies.get(name)?.value?.trim();
    const hasNonEmptyCookie = (name: string) => {
        const value = getCookieValue(name);
        return Boolean(value && value !== "undefined" && value !== "null");
    };
    const isTrueCookie = (name: string) => getCookieValue(name) === "true";

    const hasAppwriteSessionCookie = allCookies.some((cookie) =>
        cookie.name.startsWith("a_session_") || cookie.name.startsWith("a_session_legacy_")
    );

    // --- ADMIN AUTHENTICATION CHECKS ---
    // Check for tokens that you set in `adminLogin.tsx`
    const hasAdminToken = hasNonEmptyCookie("adminAccessToken");
    const isAdminAuthenticated = isTrueCookie("isAdminAuthenticated");
    const isAdminLoggedIn = hasAdminToken || isAdminAuthenticated;

    // Define what an admin route is
    const isAdminRoute = path.startsWith("/adminDashboard") || path.startsWith("/admin_Dashboard");
    const isAdminLoginRoute = path.startsWith("/admin/login");


    // --- REGULAR USER AUTHENTICATION CHECKS ---
    // These cookie names come from `legacy_pages/login_page.tsx`.
    const hasUserToken = hasNonEmptyCookie("accessToken");
    const isUserAuthenticated = isTrueCookie("isAuthenticated");
    const isFromOAuth = request.nextUrl.searchParams.get("provider") === "oauth";
    const isUserLoggedIn = hasUserToken || hasAppwriteSessionCookie || isUserAuthenticated || isFromOAuth;

    // Define what a regular user route is
    const isUserDashboardRoute = path.startsWith("/lawyerDashboard") || path.startsWith("/chat");
    const isUserLoginRoute = path === "/login";


    // ==========================================
    // ROUTING LOGIC & REDIRECTS
    // ==========================================

    // 1. Protect Admin Routes
    if (isAdminRoute && !isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. Prevent logged-in Admin from seeing Admin login page
    if (isAdminLoginRoute && isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/adminDashboard", request.url));
    }

    // 3. Protect User Routes
    if (isUserDashboardRoute && !isUserLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Prevent logged-in User from seeing the main user login page
    if (isUserLoginRoute && isUserLoggedIn) {
        return NextResponse.redirect(new URL("/chat", request.url));
    }

    // If none of the protections are triggered, let the user load the page normally
    return NextResponse.next();
}

// This tells Next.js exactly WHICH routes this Proxy file should execute on
export const config = {
    matcher: [
        "/lawyerDashboard/:path*",
        "/chat/:path*",
        "/login",
        "/adminDashboard/:path*",
        "/admin/login",
        "/admin/login/:path*",
    ],
};
