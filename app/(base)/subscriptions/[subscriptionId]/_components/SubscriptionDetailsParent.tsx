import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import {
  getSubscriptionWithBillDuesByIdCached,
  getSubscriptionBillsGroupedByYearByIdCached,
} from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsHeader from './SubscriptionDetailsHeader';
import SubscriptionDetailsMetadata from './SubscriptionDetailsMetadata';
import SubscriptionDetailsBillsTableParent from './SubscriptionDetailsBillsTableParent';

interface SubscriptionDetailsParentProps {
  paramsPromise: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailsParent({ paramsPromise }: SubscriptionDetailsParentProps) {
  const params = await paramsPromise;
  const { subscriptionId } = params;

  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId);
  const billDuesGroupedByYear: BillsDueGroupedByYearObject[] = await getSubscriptionBillsGroupedByYearByIdCached(subscriptionId);

  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <SubscriptionDetailsHeader subscription={ subscription } />
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <SubscriptionDetailsMetadata subscription={ subscription } />
        <SubscriptionDetailsBillsTableParent billDues={ billDuesGroupedByYear } />
      </div>
    </div>
  );
}
