/**
 * app/api/chat/migrate-guest/route.ts
 *
 * POST /api/chat/migrate-guest
 *
 * Replays locally-stored guest messages to the backend under a real user_id,
 * building a proper MongoDB chat session for the newly registered user.
 *
 * Body:
 *   {
 *     user_id: string,          // MongoDB user _id of the newly created user
 *     messages: Message[]       // guest messages from Zustand store
 *   }
 *
 * Strategy:
 *   - Filter only 'user' messages (questions asked by guest)
 *   - POST each question to /chat/ask with the real user_id
 *   - First call omits session_id  → backend creates a new session and returns it
 *   - Subsequent calls pass session_id → they append to the same session
 *   - Returns { session_id, migrated_count }
 */

export const runtime = 'nodejs';

const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const user_id = typeof body.user_id === 'string' ? body.user_id.trim() : '';
    const messages: Array<{ sender: string; text: string }> = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (!user_id) {
      return Response.json({ message: 'user_id is required' }, { status: 400 });
    }

    // Extract only the user questions (in order)
    const userMessages = messages.filter((m) => m.sender === 'user');

    if (userMessages.length === 0) {
      return Response.json({ session_id: null, migrated_count: 0 }, { status: 200 });
    }

    let session_id: string | null = null;
    let migrated_count = 0;

    for (const msg of userMessages) {
      const question = msg.text?.trim();
      if (!question) continue;

      const payload: Record<string, string> = {
        question,
        user_id,
        mode: 'legal',
      };
      if (session_id) {
        payload.session_id = session_id;
      }

      try {
        const res = await fetch(`${BASE_API_URL}/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          // Capture session_id from the first successful response
          if (!session_id && data.session_id) {
            session_id = data.session_id;
          }
          migrated_count++;
        } else {
          console.warn(`[migrate-guest] /chat/ask returned ${res.status} for question: "${question}"`);
        }
      } catch (fetchErr: any) {
        console.warn(`[migrate-guest] fetch error for question "${question}":`, fetchErr.message);
      }
    }

    return Response.json({ session_id, migrated_count }, { status: 200 });

  } catch (err: any) {
    console.error('[/api/chat/migrate-guest] Error:', err.message);
    return Response.json({ message: `Migration failed: ${err.message}` }, { status: 502 });
  }
}
