import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── GET /api/rag/documents — list all documents ──────────────────────────────
export async function GET() {
  try {
    const resp = await fetch(`${API_URL}/rag/documents`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.detail || 'Failed to list documents.' }, { status: resp.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'RAG server unreachable.' }, { status: 503 });
  }
}

// ── POST /api/rag/documents — upload a document ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resp = await fetch(`${API_URL}/rag/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.detail || 'Upload failed.' }, { status: resp.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'RAG server unreachable.' }, { status: 503 });
  }
}
