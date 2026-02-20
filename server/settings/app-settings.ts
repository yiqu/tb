'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { setCookie, getCookieByName } from '@/lib/cookies';
import { SETTINGS_APPLICATION_ADMIN_MODE_COOKIE_NAME, SETTINGS_APPLICATION_COMPACT_MODE_COOKIE_NAME } from '@/constants/constants';

export async function setSettingsApplicationCompactMode(isCompactMode: boolean) {
  await setCookie(SETTINGS_APPLICATION_COMPACT_MODE_COOKIE_NAME, isCompactMode ? 'true' : 'false');
}

export async function getSettingsApplicationCompactMode(): Promise<boolean> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_APPLICATION_COMPACT_MODE_COOKIE_NAME);

  if (!cookie) {
    return false;
  }
  return cookie.value === 'true' ? true : false;
}

export async function setSettingsApplicationAdminMode(isAdminMode: boolean) {
  await setCookie(SETTINGS_APPLICATION_ADMIN_MODE_COOKIE_NAME, isAdminMode ? 'true' : 'false');
}

export async function getSettingsApplicationAdminMode(): Promise<boolean> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_APPLICATION_ADMIN_MODE_COOKIE_NAME);

  if (!cookie) {
    return false;
  }
  return cookie.value === 'true' ? true : false;
}
