'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { setCookie, getCookieByName } from '@/lib/cookies';
import { SETTINGS_USER_AVATAR_COOKIE_NAME } from '@/constants/constants';

export async function setSettingsUpdateAvatarImage(avatarId: string) {
  await setCookie(SETTINGS_USER_AVATAR_COOKIE_NAME, avatarId);
}

export async function getSettingsUpdateAvatarImage(): Promise<string> {
  const cookie: RequestCookie | undefined = await getCookieByName(SETTINGS_USER_AVATAR_COOKIE_NAME);

  if (!cookie) {
    return '1';
  }
  return cookie.value;
}
