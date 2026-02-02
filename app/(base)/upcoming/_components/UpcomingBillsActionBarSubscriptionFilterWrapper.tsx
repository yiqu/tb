import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import UpcomingBillsActionBarSubscriptionFilter from './UpcomingBillsActionBarSubscriptionFilter';

export default function UpcomingBillsActionBarSubscriptionFilterWrapper() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <Suspense fallback={ <ActionBarButtonSkeleton /> }>
      <UpcomingBillsActionBarSubscriptionFilter allSubscriptionsPromise={ allSubscriptionsPromise } />
    </Suspense>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}
