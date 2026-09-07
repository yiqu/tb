/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { getAllBillsCached } from '@/server/bills/bills.server';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import SearchTableContent from './SearchTableContent';

export default async function SearchTableParent() {
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.search);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, null);

  return (
    <DisplayCard className="w-full">
      <CardContent className="overflow-x-auto">
        <SearchTableContent billDues={ billDues.billDues } sortData={ billDues.sortData } pageId={ SORT_DATA_PAGE_IDS.search } />
      </CardContent>
    </DisplayCard>
  );
}
