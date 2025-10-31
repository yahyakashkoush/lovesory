import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add cache-busting headers to all API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  // Add headers to prevent caching on main page
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
