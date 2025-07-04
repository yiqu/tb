import { getAvatarImgUrlById } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';

async function FooterAvatarLogo({ avatarImgUrl }: { avatarImgUrl: string; user: UserProfile | null }) {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={ avatarImgUrl } alt={ 'avatar' } />
      <AvatarFallback className="rounded-lg">
        <Skeleton className={ `h-8 w-11 rounded-full` } />
      </AvatarFallback>
    </Avatar>
  );
}

export default async function FooterAvatarLogoSuspended() {
  const avatarId: string = await getSettingsUpdateAvatarImage();
  const avatarImgUrl: string = getAvatarImgUrlById(avatarId);
  const user: UserProfile | null = await getUserCached();

  return <FooterAvatarLogo avatarImgUrl={ avatarImgUrl } user={ user } />;
}
