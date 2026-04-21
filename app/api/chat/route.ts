export const runtime = 'nodejs';

import { isAuthenticatedFromRequest } from '@/proxy';

const CHAT_BASE_URL =
  process.env.CHAT_API_URL ??
  'https://unbonneted-stratagemical-hal.ngrok-free.dev';

export async function POST(req: Request) {
  try {
    if (!isAuthenticatedFromRequest(req)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return Response.json(
        { message: 'Question is required' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${CHAT_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
      body: JSON.stringify({ question }),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes
        .json()
        .catch(() => ({ message: 'Chat backend error' }));
      return Response.json(
        { message: errorData.message || 'Chat backend error' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json(
      { message: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
