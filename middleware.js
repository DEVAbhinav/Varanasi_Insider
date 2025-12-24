import { NextResponse } from 'next/server';

// Redirects for legacy/crawled URLs to canonical pages
const REDIRECTS = {
  '/en/city/varanasi/taxi/varanasi-airport-transfer-directory': '/en/city/varanasi/taxi',
  '/hi/city/varanasi/taxi/varanasi-airport-transfer-directory': '/hi/city/varanasi/taxi',
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Handle explicit redirects first
  if (REDIRECTS[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS[pathname];
    return NextResponse.redirect(url, 301);
  }
  
  // Check if the pathname contains uppercase letters (excluding static files)
  const lowercasePathname = pathname.toLowerCase();
  
  // If the pathname is different when lowercased, redirect to lowercase version
  if (pathname !== lowercasePathname) {
    const url = request.nextUrl.clone();
    url.pathname = lowercasePathname;
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.webp|.*\\.ico).*)',
  ],
};
