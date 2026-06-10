// mock api route for developing, should not ever be called once the real api is implemented
import { NextResponse } from 'next/server';
import exampleBooksResponse from '@/utils/exampleBooksResponse.json';


export async function GET(request: Request) {
const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  if (request.method !== 'GET') {
    await request.text().catch(() => null);
  }

 return NextResponse.json(exampleBooksResponse);
}
