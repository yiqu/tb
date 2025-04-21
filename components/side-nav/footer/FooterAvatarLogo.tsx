import { Suspense } from 'react';

import { User } from '@/models/auth/user.model';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

async function FooterAvatarLogo() {
  const user: User = {
    avatarUrl: '',
    email: '',
    firstName: 'Kevin',
    lastName: 'Qu',
    id: '',
  };

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={ user.avatarUrl } alt={ 'avatar' } />
      <AvatarFallback className="rounded-lg">
        { user.firstName.charAt(0) }
        { user.lastName.charAt(0) }
      </AvatarFallback>
    </Avatar>
  );
}

export default function FooterAvatarLogoSuspended() {
  return (
    <Suspense fallback={ <Skeleton className="h-8 w-11 rounded-full" /> }>
      <FooterAvatarLogo />
    </Suspense>
  );
}
