import { Suspense } from 'react';

import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilter';

export default function BillsActionBarSubscriptionFilterWrapper() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <Suspense>
      <BillsActionBarSubscriptionFilter allSubscriptionsPromise={ allSubscriptionsPromise } />
    </Suspense>
  );
}
