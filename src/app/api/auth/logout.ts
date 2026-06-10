import { NextRequest, NextResponse } from 'next/server';

interface LogoutResponse {
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
