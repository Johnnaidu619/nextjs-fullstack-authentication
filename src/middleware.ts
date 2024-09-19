import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = ['*','http://localhost:59447','http://localhost:3000'];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Check if the request origin is in the allowedOrigins array
  if (origin && allowedOrigins.includes(origin)) {
    // If this is a preflight request, respond with the necessary CORS headers
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });

      // Set the necessary CORS headers for preflight requests
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');

      return response;
    }

    // Add the CORS headers for normal requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  }

  // For all other requests that don't match the allowed origins, continue without CORS headers
  return NextResponse.next();
}

// Configuration for which routes this middleware should apply to
export const config = {
  matcher: [
    '/api/:path*' // Apply to all API routes
  ],
};
