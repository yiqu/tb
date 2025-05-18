import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import AccountLeftNavNameDisplay from './AccountLeftNavNameDisplay';

export default function AccountLeftNavNameDisplayWrapper() {
  return (
    <Suspense fallback={ <AccountLeftNavNameDisplaySkeleton /> }>
      <AccountLeftNavNameDisplay />
    </Suspense>
  );
}

function AccountLeftNavNameDisplaySkeleton() {
  return <Skeleton className="h-10 w-full" />;
}
