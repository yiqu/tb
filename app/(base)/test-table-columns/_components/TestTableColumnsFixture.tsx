'use client';

import DisplayCard from '@/shared/components/DisplayCard';
import { CardContent } from '@/components/ui/card';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel, getSortDataWithPageId } from '@/models/sort-data/SortData.model';
import { BillDue, SubscriptionOriginal, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import BillsTableParentContent from '@/app/(base)/bills/_components/BillsTableParentContent';

const FIXTURE_SUBSCRIPTION_NAMES: string[] = ['Netflix', 'Spotify', 'Hulu', 'Disney+', 'Amazon Prime', 'HBO Max'];

/** Fixed epochs (EST) so the fixture never reads the current time while rendering. */
const FIXTURE_DATE_ADDED_EPOCH = 1767628800000; // 2026-01-05T12:00:00 EST
const FIXTURE_DUE_DATE_EPOCH = 1770048000000; // 2026-02-02T12:00:00 EST
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/** Static, dependency free rows so the table (and the column show/hide menu) can be exercised without a database. */
function getFixtureBillDues(): BillDueWithSubscription[] {
  return FIXTURE_SUBSCRIPTION_NAMES.map((name: string, index: number) => {
    const dateAdded: Date = new Date(FIXTURE_DATE_ADDED_EPOCH + index * ONE_DAY_IN_MS);

    const subscription: SubscriptionOriginal = {
      approved: index % 2 === 0,
      billCycleDuration: 'monthly',
      billCycleInDays: 30,
      billStartDate: '2026-01-01',
      cost: 10 + index,
      dateAdded,
      updatedAt: null,
      description: `${name} subscription`,
      id: `subscription-${index}`,
      name,
      signed: index % 3 === 0,
      url: `https://example.com/${name.toLowerCase()}`,
    };

    const billDue: BillDue = {
      id: `bill-due-${index}`,
      subscriptionId: subscription.id,
      dueDate: `${FIXTURE_DUE_DATE_EPOCH + index * ONE_DAY_IN_MS}`,
      paid: index % 2 === 0,
      reimbursed: index % 3 === 0,
      dateAdded,
      updatedAt: null,
      cost: 10 + index,
    };

    return { ...billDue, subscription };
  });
}

const sortData: SortDataModel = getSortDataWithPageId(SORT_DATA_PAGE_IDS.search);

/**
 * Local harness for the table column show/hide feature: renders the bills table off fake data so the
 * three dot menu (Hide Column + Show / Hide Columns submenu) can be tried without any server data.
 */
export default function TestTableColumnsFixture() {
  const billDues: BillDueWithSubscriptionAndSortData = {
    billDues: getFixtureBillDues(),
    sortData,
    totalPages: 1,
    totalBillsCount: FIXTURE_SUBSCRIPTION_NAMES.length,
    startIndex: 0,
    endIndex: FIXTURE_SUBSCRIPTION_NAMES.length,
    yearParams: undefined,
    monthParams: undefined,
    startDateEpoch: 0,
    endDateEpoch: 0,
  };

  return (
    <DisplayCard className="w-full">
      <CardContent className="overflow-x-auto">
        <BillsTableParentContent
          billDues={ billDues }
          sortData={ sortData }
          pageId={ SORT_DATA_PAGE_IDS.search }
          tableId="test-table-columns-table"
        />
      </CardContent>
    </DisplayCard>
  );
}
