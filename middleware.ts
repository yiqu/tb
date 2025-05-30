import { NextRequest, NextResponse } from 'next/server';

import { getCookieByName } from './lib/cookies';
import { CONSENT_GIVEN_COOKIE_NAME, ADMIN_PASSWORD_CORRECT_COOKIE_NAME } from './constants/constants';

export async function middleware(request: NextRequest) {
  const nextPath = request.nextUrl.pathname;

  // Skip API routes
  if (nextPath.startsWith('/api')) {
    return NextResponse.next();
  }
  // consent is already given, proceed
  if (nextPath === '/consent') {
    const shouldAskConsent = process.env.NEXT_PUBLIC_ASK_CONSENT === 'true';
    if (shouldAskConsent) {
      const consentGivenDateCookie = await getCookieByName(CONSENT_GIVEN_COOKIE_NAME);
      const consentGivenDate: string | undefined = consentGivenDateCookie?.value;

      if (consentGivenDate !== undefined) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (nextPath.startsWith('/')) {
    const shouldAskConsent = process.env.NEXT_PUBLIC_ASK_CONSENT === 'true';
    // check if consent is needed
    if (shouldAskConsent) {
      const consentGivenDateCookie = await getCookieByName(CONSENT_GIVEN_COOKIE_NAME);
      const consentGivenDate: string | undefined = consentGivenDateCookie?.value;

      const nextPathname = request.nextUrl.pathname;
      const nextPathSearchParams = request.nextUrl.search;

      const nextPathFullUrl: string = `${nextPathname}${nextPathSearchParams}`;

      const redirectUrlParams = new URLSearchParams();
      redirectUrlParams.set('redirectUrl', nextPathFullUrl);

      const nextUrl = new URL('/consent', request.url);
      nextUrl.search = redirectUrlParams.toString();

      if (consentGivenDate === undefined) {
        return NextResponse.redirect(nextUrl);
      }
    }

    // check if admin password is in cookies already
    if (nextPath === '/login') {
      const isAdminPWCorrect = await getCookieByName(ADMIN_PASSWORD_CORRECT_COOKIE_NAME);
      const isCorrect: boolean = isAdminPWCorrect?.value === 'true';
      if (isCorrect) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // redirect to login if admin password is not in cookies
    if (nextPath === '/admin') {
      const isAdminPWCorrect = await getCookieByName(ADMIN_PASSWORD_CORRECT_COOKIE_NAME);
      const isCorrect: boolean = isAdminPWCorrect?.value === 'true';
      if (!isCorrect) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // DO not match the route: /consent, and /welcome
  matcher: ['/((?!.*\\..*|_next|welcome).*)', '/', '/(api|trpc)(.*)'],
};
