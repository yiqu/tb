import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import AccountLeftNavIsAdminDisplay from './AccountLeftNavIsAdminDisplay';

export default function AccountLeftNavIsAdminDisplayWrapper() {
  return (
    <Suspense fallback={ <AccountLeftNavIsAdminDisplaySkeleton /> }>
      <AccountLeftNavIsAdminDisplay />
    </Suspense>
  );
}

function AccountLeftNavIsAdminDisplaySkeleton() {
  return <Skeleton className="h-10 w-full" />;
}
