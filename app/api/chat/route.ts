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
const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const REST_CHAT_URL = `${BASE_API_URL}/chat`;

export async function GET(req: Request) {
  try {
    const isAuth = isAuthenticatedFromRequest(req);
    console.log(`[Proxy GET] Auth status: ${isAuth}`);

    if (!isAuth) {
      console.warn('[Proxy GET] Unauthorized access attempt');
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id') || 'guest_user';
    const session_id = searchParams.get('session_id');

    let endpoint = `${REST_CHAT_URL}/sessions?user_id=${user_id}`;
    if (session_id) {
      endpoint = `${REST_CHAT_URL}/history?session_id=${session_id}`;
    }

    console.log(`[Proxy GET] Fetching: ${endpoint}`);

    const restRes = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => {
      console.error('[Proxy GET] Fetch failed:', err.message);
      throw err;
    });

    if (!restRes.ok) {
      const errBody = await restRes.json().catch(() => ({}));
      console.error(`[Proxy GET] Backend returned error ${restRes.status}:`, errBody);
      const message = errBody.detail ?? errBody.message ?? `REST API error ${restRes.status}`;
      return Response.json({ message }, { status: restRes.status });
    }

    const data = await restRes.json();
    return Response.json(data, { status: 200 });

  } catch (err: any) {
    console.error('[/api/chat] Proxy GET error:', err.message);
    return Response.json({ message: `Backend connection failed: ${err.message}` }, { status: 502 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = isAuthenticatedFromRequest(req);
    console.log(`[Proxy POST] Auth status: ${isAuth}`);

    if (!isAuth) {
      console.warn('[Proxy POST] Unauthorized access attempt');
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    const user_id = typeof body.user_id === 'string' && body.user_id.trim() ? body.user_id.trim() : 'guest_user';
    const session_id = typeof body.session_id === 'string' ? body.session_id.trim() : null;
    const mode = body.mode === 'research' ? 'research' : 'legal'; // default to 'legal'

    if (!question) {
      return Response.json({ message: 'Question is required' }, { status: 400 });
    }

    const endpoint = `${REST_CHAT_URL}/ask`;
    console.log(`[Proxy POST] Forwarding to: ${endpoint} (session_id: ${session_id}, mode: ${mode})`);

    const restRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, user_id, session_id, mode }),
    }).catch(err => {
      console.error('[Proxy POST] Fetch failed:', err.message);
      throw err;
    });

    if (!restRes.ok) {
      const errBody = await restRes.json().catch(() => ({}));
      console.error(`[Proxy POST] Backend returned error ${restRes.status}:`, errBody);
      const message = errBody.detail ?? errBody.message ?? `REST API error ${restRes.status}`;
      return Response.json({ message }, { status: restRes.status });
    }

    const data = await restRes.json();
    return Response.json(data, { status: 200 });

  } catch (err: any) {
    console.error('[/api/chat] Proxy error:', err.message);
    return Response.json(
      { message: `Backend connection failed: ${err.message}` },
      { status: 502 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAuthenticatedFromRequest(req)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    const title = searchParams.get('title');

    if (!session_id || !title) {
      return Response.json({ message: 'session_id and title are required' }, { status: 400 });
    }

    const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    const REST_CHAT_URL = `${BASE_API_URL}/chat`;
    const endpoint = `${REST_CHAT_URL}/session/${session_id}/title?title=${encodeURIComponent(title)}`;
    console.log(`[Proxy PATCH] Renaming session: ${endpoint}`);

    const restRes = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!restRes.ok) {
      const errBody = await restRes.json().catch(() => ({}));
      return Response.json({ message: errBody.detail || 'Failed to rename' }, { status: restRes.status });
    }

    return Response.json({ message: 'Success' }, { status: 200 });

  } catch (err: any) {
    console.error('[/api/chat] Proxy PATCH error:', err.message);
    return Response.json({ message: 'Connection failed' }, { status: 502 });
  }
}

