import { Suspense } from 'react';

import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import { Skeleton } from '../ui/skeleton';
import EditBillSubscriptionsSelect from './EditBillSubscriptionsSelect';

export default function EditBillSubscriptionsWrapper() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <Suspense fallback={ <Skeleton className="h-15 w-full" /> }>
      <EditBillSubscriptionsSelect subscriptionsPromise={ allSubscriptionsPromise } />
    </Suspense>
  );
}
