/**
 * app/api/share/save/route.ts
 *
 * POST /api/share/save
 *
 * Clones a shared chat session into a brand-new session owned by the
 * currently authenticated user.
 *
 * Body: { shareId: string, userId: string }
 * Returns: { newSessionId: string }
 */

export const runtime = 'nodejs';

import { isAuthenticatedFromRequest } from '@/proxy';

const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function POST(req: Request) {
  try {
    if (!isAuthenticatedFromRequest(req)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const shareId = typeof body.shareId === 'string' ? body.shareId.trim() : '';
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';

    if (!shareId || !userId) {
      return Response.json({ message: 'shareId and userId are required' }, { status: 400 });
    }

    const endpoint = `${BASE_API_URL}/chat/share/${encodeURIComponent(shareId)}/save`;
    console.log(`[Share Save POST] Saving shared chat ${shareId} for user ${userId}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.detail ?? err.message ?? `Backend error ${res.status}`;
      return Response.json({ message }, { status: res.status });
    }

    const data = await res.json();
    // Backend returns { new_session_id }, rename to camelCase for frontend
    return Response.json({ newSessionId: data.new_session_id }, { status: 200 });
  } catch (err: any) {
    console.error('[/api/share/save] POST error:', err.message);
    return Response.json({ message: `Backend connection failed: ${err.message}` }, { status: 502 });
  }
}
