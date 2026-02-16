import z from 'zod';

import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { CardFooter, CardContent } from '@/components/ui/card';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { getAllUpcomingBillsCached } from '@/server/bills/bills.server';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';

import DateRangeEpochButton from '../../_dashboard/_components/DateRangeEpochButton';
import BillsTableParentContent from '../../bills/_components/BillsTableParentContent';

interface UpcomingBillsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function UpcomingBillsTableParent({ searchParamsPromise, paginationPromise }: UpcomingBillsTableParentProps) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllUpcomingBillsCached(sortData, pagination, searchParams);

  if (billDues.billDues.length === 0) {
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-2">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
      </div>
    );
  }

  return (
    <DisplayCard className="w-full pt-0">
      <CardContent className="overflow-x-auto border-b px-0">
        <BillsTableParentContent billDues={ billDues } sortData={ sortData } pageId={ SORT_DATA_PAGE_IDS.upcoming } loadingMaskRowCount={ 10 } />
      </CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-between">
        <div>
          <DateRangeEpochButton billDuesData={ billDues } />
        </div>
        <div></div>
      </CardFooter>
    </DisplayCard>
  );
}
