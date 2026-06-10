import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/utils/apiFunctions';
import { generateJWT } from '@/utils/jwt';

interface LoginResponse {
  message: string;
  email?: string;
  token?: string;
  expiresAt?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request body schema

    if (!body) {
      return NextResponse.json(
        { message: 'Email and password are required and must be valid strings' },
        { status: 400 }
      );
    }

    const { email, password } = body as { email: string; password: string };


    // Call the validation function
    const isValid = await validateCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token (24 hour expiration)
    const token = generateJWT(email, 24);
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 3600;

    // Login successful
    return NextResponse.json(
      { message: 'Login successful', email, token, expiresAt },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
