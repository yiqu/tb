import { Suspense } from 'react';

import { Skeleton } from '@/components/ui-pre-19/skeleton';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionsActionBarSubscriptionFilter from './SubscriptionsActionBarSubscriptionFilter';

export default function SubscriptionsActionBarSubscriptionFilterWrapper() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <Suspense fallback={ <ActionBarButtonSkeleton /> }>
      <SubscriptionsActionBarSubscriptionFilter allSubscriptionsPromise={ allSubscriptionsPromise } />
    </Suspense>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}
