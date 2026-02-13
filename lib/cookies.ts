'use server';

import { cookies } from 'next/headers';
import { RequestCookie, ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const COOKIE_PATH_HOME = '/';
const COOKIE_MAX_AGE_1_YEAR = 31536000;

export async function getAllCookies(): Promise<RequestCookie[]> {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  return cookieStore.getAll();
}

export async function getAllCookiesAsObject(): Promise<Record<string, string>> {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  const allCookies = cookieStore.getAll();
  return Object.fromEntries(allCookies.map((c) => [c.name, c.value]));
}

export async function getCookieByName(name: string): Promise<RequestCookie | undefined> {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  return cookieStore.get(name);
}

export async function setCookie(name: string, value: string, options?: Partial<ResponseCookie>) {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.set(name, value, {
    path: COOKIE_PATH_HOME,
    maxAge: COOKIE_MAX_AGE_1_YEAR,
    ...options,
  });
}

export async function deleteCookie(name: string) {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  cookieStore.delete(name);
}
