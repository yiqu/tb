import { NextRequest, NextResponse } from 'next/server';

import { getCookieByName } from './lib/cookies';

export async function middleware(request: NextRequest) {
  const nextPath = request.nextUrl.pathname;

  console.log('matched:', nextPath);

  // Skip API routes
  if (nextPath.startsWith('/api')) {
    return NextResponse.next();
  }

  if (nextPath.startsWith('/')) {
    const shouldAskConsent = process.env.NEXT_PUBLIC_ASK_CONSENT === 'true';
    console.log('shouldAskConsent', shouldAskConsent);

    if (shouldAskConsent) {
      const consentGivenDateCookie = await getCookieByName('consent-given');
      const consentGivenDate: string | undefined = consentGivenDateCookie?.value;
      console.log('consentGivenDate', consentGivenDate, consentGivenDate === undefined);
      if (consentGivenDate !== undefined) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/consent', request.url));
      }
    }
  }

  if (nextPath === '/login') {
    const isAdminPWCorrect = await getCookieByName('admin-password-correct');
    const isCorrect: boolean = isAdminPWCorrect?.value === 'true';
    if (isCorrect) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (nextPath === '/admin') {
    const isAdminPWCorrect = await getCookieByName('admin-password-correct');
    const isCorrect: boolean = isAdminPWCorrect?.value === 'true';
    if (!isCorrect) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // DO not match the route: /consent, and /welcome
  matcher: ['/((?!.*\\..*|_next|consent|welcome).*)', '/', '/(api|trpc)(.*)', ],
};
