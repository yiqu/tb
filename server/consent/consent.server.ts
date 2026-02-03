'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { CONSENT_GIVEN_COOKIE_NAME } from '@/constants/constants';

export async function acceptConsent(redirectUrl: string | null) {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.set(CONSENT_GIVEN_COOKIE_NAME, Date.now().toString(), {
    path: '/',
    // maxAge is in seconds: 60 seconds * 60 minutes * 24 hours * 7 days = 1 week
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
  });
  if (redirectUrl) {
    redirect(redirectUrl as any, RedirectType.replace);
  } else {
    redirect('/', RedirectType.replace);
  }
}

export async function declineConsent() {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.delete(CONSENT_GIVEN_COOKIE_NAME);
  redirect('/welcome', RedirectType.replace);
}
