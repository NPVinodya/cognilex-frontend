import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── POST /api/rag/reindex — trigger RAG index rebuild ────────────────────────
export async function POST() {
  try {
    const resp = await fetch(`${API_URL}/rag/reindex`, {
      method: 'POST',
    });
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.detail || 'Reindex failed.' }, { status: resp.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'RAG server unreachable.' }, { status: 503 });
  }
}
