import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
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
  // one sort for all the per year bill dues tables on this page
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptionDetailsBillsBillsTable);
  const billDuesGroupedByYear: BillsDueGroupedByYearObject[] = await getSubscriptionBillsGroupedByYearByIdCached(subscriptionId, sortData);

  return <SubscriptionDetailsBillsTableParent billDues={ billDuesGroupedByYear } subscription={ subscription } sortData={ sortData } />;
}
