'use client';

import BillsDueTable from '@/shared/table/BillsDueTable';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { useGetRecentlyAddedBillDues } from '@/store/bills/bills.store';
import { SortDataModel, getSortDataWithPageId } from '@/models/sort-data/SortData.model';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import useOrderedVisibleTableColumns from '@/hooks/table-columns-adjust/useOrderedVisibleTableColumns';

const sortData: SortDataModel = getSortDataWithPageId(SORT_DATA_PAGE_IDS.addNewBillDueRecentlyAdded);

export default function AddedBillDues() {
  const recentlyAddedBillDues: BillDueWithSubscription[] = useGetRecentlyAddedBillDues();
  const columnsSorted: string[] = useOrderedVisibleTableColumns('bills');

  if (recentlyAddedBillDues.length === 0) {
    return null;
  }

  return (
    <DisplayCard className="w-full">
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Recently added bill dues.</CardDescription>
      </CardHeader>
      <CardContent>
        <BillsDueTable
          billDues={ recentlyAddedBillDues }
          columns={ columnsSorted }
          sortData={ sortData }
          pageId={ SORT_DATA_PAGE_IDS.addNewBillDueRecentlyAdded }
          tableId="added-bill-dues-table"
        />
      </CardContent>
    </DisplayCard>
  );
}
