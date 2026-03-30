import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const specialization = searchParams.get('specialization');
    const status = searchParams.get('status') || 'approved';

    // Build query parameters for FastAPI backend
    const params = new URLSearchParams();
    if (province) params.append('province', province);
    if (specialization) params.append('specialization', specialization);
    params.append('status', status);

    const queryString = params.toString();
    const backendUrl = `${API_BASE_URL}/lawyer/all${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching from backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lawyers from backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch lawyers',
        lawyers: [],
        count: 0
      },
      { status: 500 }
    );
  }
}