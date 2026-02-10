'use client';

import { use } from 'react';

import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionBillsGroupedByYearByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsBillsTableParent from './SubscriptionDetailsBillsTableParent';

export default function SubscriptionDetailsDialogBillsTableParentParent({
  subscriptionId,
  subscription,
}: {
  subscriptionId: string;
  subscription: SubscriptionWithBillDues;
}) {
  const billDuesGroupedByYear: BillsDueGroupedByYearObject[] = use(getSubscriptionBillsGroupedByYearByIdCached(subscriptionId));

  return <SubscriptionDetailsBillsTableParent billDues={ billDuesGroupedByYear } subscription={ subscription } />;
}
