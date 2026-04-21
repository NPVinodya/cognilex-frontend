"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useLayoutEffect(() => {
    // PROTECTION: Force Light Mode on business-critical pages
    const isProtectedRoute = 
      pathname.toLowerCase().includes("lawyerdashboard") || 
      pathname.toLowerCase().includes("lawyerregistation");

    if (isProtectedRoute) {
      document.documentElement.classList.remove("dark");
    } else {
      // Restore theme based on user preferences when leaving dashboard
      try {
        const raw = localStorage.getItem("user");
        const parsed = raw ? JSON.parse(raw) : null;
        const appearance = parsed?.preferences?.appearance;
        
        const shouldBeDark = appearance === "Dark Mode" || appearance === "System Default" || !appearance;
        
        if (shouldBeDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {}
    }
  }, [pathname]);

  return <>{children}</>;
}
