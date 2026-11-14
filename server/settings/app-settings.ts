'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { setCookie, getCookieByName } from '@/lib/cookies';
import {
  SETTINGS_APPLICATION_ADMIN_MODE_COOKIE_NAME,
  SETTINGS_APPLICATION_COMPACT_MODE_COOKIE_NAME,
  SETTINGS_TABLE_VERTICAL_BORDERS_COOKIE_NAME,
  SETTINGS_TABLE_HORIZONTAL_BORDERS_COOKIE_NAME,
} from '@/constants/constants';

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

export async function setSettingsTableHorizontalBorders(showBorders: boolean) {
  await setCookie(SETTINGS_TABLE_HORIZONTAL_BORDERS_COOKIE_NAME, showBorders ? 'true' : 'false');
}

/** Defaults to `true` (borders shown) when the cookie has never been set. */
export async function getSettingsTableHorizontalBorders(): Promise<boolean> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_TABLE_HORIZONTAL_BORDERS_COOKIE_NAME);
  return cookie?.value !== 'false';
}

export async function setSettingsTableVerticalBorders(showBorders: boolean) {
  await setCookie(SETTINGS_TABLE_VERTICAL_BORDERS_COOKIE_NAME, showBorders ? 'true' : 'false');
}

/** Defaults to `true` (borders shown) when the cookie has never been set. */
export async function getSettingsTableVerticalBorders(): Promise<boolean> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_TABLE_VERTICAL_BORDERS_COOKIE_NAME);
  return cookie?.value !== 'false';
}
