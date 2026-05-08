import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── DELETE /api/rag/documents/[fileType]/[filename] ───────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ fileType: string; filename: string }> }
) {
  const { fileType, filename } = await params;

  if (!['acts', 'cases'].includes(fileType)) {
    return NextResponse.json({ error: "fileType must be 'acts' or 'cases'." }, { status: 400 });
  }

  try {
    const resp = await fetch(
      `${API_URL}/rag/documents/${encodeURIComponent(fileType)}/${encodeURIComponent(filename)}`,
      { method: 'DELETE' }
    );
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.detail || 'Delete failed.' }, { status: resp.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'RAG server unreachable.' }, { status: 503 });
  }
}
