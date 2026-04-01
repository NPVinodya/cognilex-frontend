import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Lawyer id is required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/lawyer/${id}`;
    console.log('Fetching lawyer from backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Lawyer not found', error: errorText },
          { status: 404 }
        );
      }
      throw new Error(
        `Backend responded with status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Backend response data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lawyer from backend:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch lawyer',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}