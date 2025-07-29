import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { getSubscriptionBillsGroupedByYearByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsBillsTableParent from './SubscriptionDetailsBillsTableParent';

export default async function SubscriptionDetailsBillsTableParentParent({ subscriptionId }: { subscriptionId: string }) {
  const billDuesGroupedByYear: BillsDueGroupedByYearObject[] = await getSubscriptionBillsGroupedByYearByIdCached(subscriptionId);

  return <SubscriptionDetailsBillsTableParent billDues={ billDuesGroupedByYear } />;
}
