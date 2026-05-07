/**
 * app/api/share/route.ts
 *
 * Proxy for share-related chat endpoints.
 *
 * GET  /api/share?shareId=...   — fetch shared chat (public, no auth)
 * POST /api/share               — create a share link (auth required)
 */

export const runtime = 'nodejs';

import { isAuthenticatedFromRequest } from '@/proxy';

const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get('shareId');

    if (!shareId) {
      return Response.json({ message: 'shareId is required' }, { status: 400 });
    }

    const endpoint = `${BASE_API_URL}/chat/share/${encodeURIComponent(shareId)}`;
    console.log(`[Share GET] Fetching shared chat: ${endpoint}`);

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.detail ?? err.message ?? `Backend error ${res.status}`;
      return Response.json({ message }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err: any) {
    console.error('[/api/share] GET error:', err.message);
    return Response.json({ message: `Backend connection failed: ${err.message}` }, { status: 502 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthenticatedFromRequest(req)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

    if (!sessionId) {
      return Response.json({ message: 'sessionId is required' }, { status: 400 });
    }

    const endpoint = `${BASE_API_URL}/chat/share`;
    console.log(`[Share POST] Creating share for session: ${sessionId}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.detail ?? err.message ?? `Backend error ${res.status}`;
      return Response.json({ message }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err: any) {
    console.error('[/api/share] POST error:', err.message);
    return Response.json({ message: `Backend connection failed: ${err.message}` }, { status: 502 });
  }
}
