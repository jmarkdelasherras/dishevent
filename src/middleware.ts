import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // If the user is not signed in and trying to access a protected route
  if (!session && request.nextUrl.pathname.startsWith('/(dashboard)')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is signed in and trying to access auth pages
  if (session && (request.nextUrl.pathname.startsWith('/(auth)'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(dashboard)/:path*', '/(auth)/:path*']
};