import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionBillsGroupedByYearByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsBillsTableParent from './SubscriptionDetailsBillsTableParent';

export default async function SubscriptionDetailsBillsTableParentParent({
  subscriptionId,
  subscription,
}: {
  subscriptionId: string;
  subscription: SubscriptionWithBillDues;
}) {
  const billDuesGroupedByYear: BillsDueGroupedByYearObject[] = await getSubscriptionBillsGroupedByYearByIdCached(subscriptionId);

  return <SubscriptionDetailsBillsTableParent billDues={ billDuesGroupedByYear } subscription={ subscription } />;
}
