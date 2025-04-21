import { setCookie } from '@/lib/cookies';

export async function updateNickName(formData: FormData) {
  const name = formData.get('nickName') ? (formData.get('nickName') as string) : '';
  const trimmed = name.trim();
  await setCookie('user-nick-name', trimmed);
}
