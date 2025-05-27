'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { CONSENT_GIVEN_COOKIE_NAME, ADMIN_PASSWORD_CORRECT_COOKIE_NAME } from '@/constants/constants';

export async function triggerPasswordCorrect() {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.set(ADMIN_PASSWORD_CORRECT_COOKIE_NAME, 'true', {
    path: '/',
    maxAge: 86400, // 1 day
  });
  redirect('/admin', RedirectType.replace);
}

export async function getAdminPasswordCorrect() {
  return null;
}

export async function removeIsAdminPasswordCorrectAndConsentGiven() {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.delete(ADMIN_PASSWORD_CORRECT_COOKIE_NAME);
  cookieStore.delete(CONSENT_GIVEN_COOKIE_NAME);
  redirect('/', RedirectType.replace);
}
