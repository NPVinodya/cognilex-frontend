import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter } from "next/font/google";
import Script from "next/script";
import React from "react";
import "./globals.css";
import ThemeManager from "@/components/theme/ThemeManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CogniLex AI - Legal Intelligence",
  description: "Secure AI intelligence tailored for Sri Lankan jurisprudence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeBootScript = `
    (function () {
      try {
        var raw = localStorage.getItem("user");
        var parsed = raw ? JSON.parse(raw) : null;
        var appearance = parsed && parsed.preferences ? parsed.preferences.appearance : null;
        var useDark = !appearance || appearance === "Dark Mode" || appearance === "System Default";
        
        // PROTECTION: Force Light Mode on critical business-critical pages to prevent visibility issues
        var path = window.location.pathname.toLowerCase();
        if (path.includes("lawyerdashboard") || path.includes("lawyerregistation")) {
          useDark = false;
        }

        if (useDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        document.documentElement.classList.add("dark");
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} antialiased`}
      >
        <ThemeManager>
          {children}
        </ThemeManager>
      </body>
    </html>
  );
}
