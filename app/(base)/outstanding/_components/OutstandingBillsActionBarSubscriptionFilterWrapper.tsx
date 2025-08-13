import { Suspense } from 'react';

import { Skeleton } from '@/components/ui-pre-19/skeleton';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import OutstandingBillsActionBarSubscriptionFilter from './OutstandingBillsActionBarSubscriptionFilter';

export default function OutstandingBillsActionBarSubscriptionFilterWrapper() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <Suspense fallback={ <ActionBarButtonSkeleton /> }>
      <OutstandingBillsActionBarSubscriptionFilter allSubscriptionsPromise={ allSubscriptionsPromise } />
    </Suspense>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}
