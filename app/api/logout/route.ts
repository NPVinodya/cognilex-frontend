export const runtime = "nodejs";

import { logoutSetCookieHeaders } from "@/proxy";

export async function POST() {
  const headers = new Headers();
  for (const setCookie of logoutSetCookieHeaders()) {
    headers.append("Set-Cookie", setCookie);
  }

  return new Response(null, { status: 204, headers });
}

