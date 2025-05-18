'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { ADMIN_PASSWORD_CORRECT_COOKIE_NAME } from '@/constants/constants';

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
