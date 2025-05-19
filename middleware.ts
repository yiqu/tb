import { NextRequest, NextResponse } from 'next/server';

import { getCookieByName } from './lib/cookies';

export async function middleware(request: NextRequest) {
  const nextPath = request.nextUrl.pathname;

  const isAdminPWCorrect = await getCookieByName('admin-password-correct');
  const isCorrect: boolean = isAdminPWCorrect?.value === 'true';

  if (nextPath === '/login') {
    if (isCorrect) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (nextPath === '/admin') {
    if (!isCorrect) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login'],
};
