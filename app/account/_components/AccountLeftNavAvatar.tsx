/* eslint-disable readable-tailwind/multiline */
import Image from 'next/image';

import { getAvatarImgUrlById } from '@/lib/utils';
import { getSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';

export default async function AccountLeftNavAvatar() {
  const avatarId: string = await getSettingsUpdateAvatarImage();
  const avatarImgUrl: string = getAvatarImgUrlById(avatarId);

  return (
    <div className={ `overflow-hidden rounded-4xl border-1 border-gray-300 bg-sidebar p-3 pb-0` }>
      <Image src={ avatarImgUrl } alt="Avatar" width={ 190 } height={ 190 } className={ `` } />
    </div>
  );
}
