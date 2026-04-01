import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // --- ADMIN AUTHENTICATION CHECKS ---
    // Check for tokens that you set in `adminLogin.tsx`
    const adminToken = request.cookies.get("adminAccessToken")?.value;
    const isAdminAuthenticated = request.cookies.get("isAdminAuthenticated")?.value === "true";

    // Define what an admin route is
    const isAdminRoute = path.startsWith("/adminDashboard") || path.startsWith("/admin_Dashboard");
    const isAdminLoginRoute = path.startsWith("/admin/login");


    // --- REGULAR USER AUTHENTICATION CHECKS ---
    // Check for user tokens (like in chat_page.tsx)
    const userToken = request.cookies.get("accessToken")?.value;
    const isUserAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";

    // Define what a regular user route is
    const isUserDashboardRoute = path.startsWith("/lawyerDashboard") || path.startsWith("/chat");
    const isUserLoginRoute = path === "/login";


    // ==========================================
    // ROUTING LOGIC & REDIRECTS
    // ==========================================

    // 1. Protect Admin Routes
    if (isAdminRoute && (!adminToken && !isAdminAuthenticated)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. Prevent logged-in Admin from seeing Admin login page
    if (isAdminLoginRoute && (adminToken || isAdminAuthenticated)) {
        return NextResponse.redirect(new URL("/adminDashboard", request.url));
    }

    // 3. Protect User Routes
    if (isUserDashboardRoute && (!userToken && !isUserAuthenticated)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Prevent logged-in User from seeing the main user login page
    if (isUserLoginRoute && (userToken || isUserAuthenticated)) {
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
        "/admin/login/:path*",
    ],
};
