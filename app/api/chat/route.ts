/**
 * app/api/chat/route.ts
 *
 * Next.js server-side proxy for the CogniLex AI chat.
 *
 * Request flow:
 *   Browser  →  POST /api/chat  (this file, Next.js server)
 *            →  POST {REST_API}/chat/ask  (cognilex-backend FastAPI, port 8000)
 *            →  POST {RAG_API}/ask        (CogniLex-RAG FastAPI, port 8001)
 *
 * Environment variable:
 *   CHAT_API_URL  — base URL of the REST API's chat prefix
 *                   e.g.  http://localhost:8000/chat
 *
 * RAG response relayed verbatim:
 *   { answer: string, mode: string, sources: string[], latency: string }
 */

export const runtime = 'nodejs';

import { isAuthenticatedFromRequest } from '@/proxy';

// Base URL of the REST API chat prefix (e.g. http://localhost:8000/chat)
const REST_CHAT_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/chat';

export async function POST(req: Request) {
  try {
    // ── Auth guard ────────────────────────────────────────────────────────────
    if (!isAuthenticatedFromRequest(req)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse & validate request body ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));

    const question =
      typeof body.question === 'string' ? body.question.trim() : '';
    const user_id =
      typeof body.user_id === 'string' && body.user_id.trim()
        ? body.user_id.trim()
        : 'guest_user';

    if (!question) {
      return Response.json(
        { message: 'Question is required' },
        { status: 400 }
      );
    }

    // ── Forward to REST API  →  POST /chat/ask ────────────────────────────────
    const restRes = await fetch(`${REST_CHAT_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, user_id }),
    });

    // ── Relay error responses from REST API ───────────────────────────────────
    if (!restRes.ok) {
      const errBody = await restRes.json().catch(() => ({}));
      // FastAPI uses { detail: ... } for HTTPException
      const message =
        errBody.detail ?? errBody.message ?? `REST API error ${restRes.status}`;
      return Response.json({ message }, { status: restRes.status });
    }

    // ── Relay successful response { answer, mode, sources, latency } ──────────
    const data = await restRes.json();
    return Response.json(data, { status: 200 });

  } catch (err) {
    console.error('[/api/chat] Proxy error:', err);
    return Response.json(
      {
        message:
          'Could not reach the backend API. Is cognilex-backend running on port 8000?',
      },
      { status: 502 }
    );
  }
}
