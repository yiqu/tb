import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import AccountLeftNavAvatar from './AccountLeftNavAvatar';

export default async function AccountLeftNavAvatarWrapper() {
  return (
    <Suspense fallback={ <AccountLeftNavAvatarSkeleton /> }>
      <AccountLeftNavAvatar />
    </Suspense>
  );
}

function AccountLeftNavAvatarSkeleton() {
  return (
    <div className="min-h-[288px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
