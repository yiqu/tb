'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { setCookie, getCookieByName } from '@/lib/cookies';
import { AppFont, AppVibe } from '@/models/settings/general-settings.models';
import { SETTINGS_USER_FONT_COOKIE_NAME, SETTINGS_USER_VIBE_COOKIE_NAME } from '@/constants/constants';

export async function setSettingsApplicationVibe(vibe: string) {
  await setCookie(SETTINGS_USER_VIBE_COOKIE_NAME, vibe);
}

export async function getSettingsApplicationVibe(): Promise<AppVibe> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_USER_VIBE_COOKIE_NAME);

  if (!cookie) {
    return 'vintage';
  }
  return cookie.value as AppVibe;
}

export async function setSettingsApplicationFont(font: string) {
  await setCookie(SETTINGS_USER_FONT_COOKIE_NAME, font);
}

export async function getSettingsApplicationFont(): Promise<AppFont | undefined> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_USER_FONT_COOKIE_NAME);

  if (!cookie) {
    return undefined;
  }

  return cookie.value as AppFont;
}
