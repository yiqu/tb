import { setCookie } from '@/lib/cookies';

export async function settingsUpdateAvatarImage(avatarSrcUrl: string) {
  await setCookie('user-avatar', avatarSrcUrl);
}
