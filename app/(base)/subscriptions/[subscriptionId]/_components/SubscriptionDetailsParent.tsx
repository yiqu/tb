import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsHeader from './SubscriptionDetailsHeader';
import SubscriptionDetailsMetadata from './SubscriptionDetailsMetadata';

interface SubscriptionDetailsParentProps {
  paramsPromise: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailsParent({ paramsPromise }: SubscriptionDetailsParentProps) {
  const params = await paramsPromise;
  const { subscriptionId } = params;

  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId);

  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <SubscriptionDetailsHeader subscription={ subscription } />
      <div className="flex w-full flex-col items-start justify-start gap-y-3">
        <SubscriptionDetailsMetadata subscription={ subscription } />
      </div>
    </div>
  );
}
