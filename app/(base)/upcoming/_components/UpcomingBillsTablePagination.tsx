import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getAllBillsCountCached, getAllUpcomingBillsCached } from '@/server/bills/bills.server';

import { isSearchParamsExist } from './bills.utils';
import UpcomingBillsActionBarClearAllFilters from './UpcomingBillsActionBarClearAllFilters';
import UpcomingBillsTablePaginationPageSelect from './UpcomingBillsTablePaginationPageSelect';
import UpcomingBillsTablePaginationPageCountSelect from './UpcomingBillsTablePaginationPageCountSelect';

interface UpcomingBillsTablePaginationProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function UpcomingBillsTablePagination({ searchParamsPromise, paginationPromise }: UpcomingBillsTablePaginationProps) {
  const pagination: PaginationDataModel | null = await paginationPromise;
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllUpcomingBillsCached(sortData, pagination, searchParams);
  const totalBillsCount: number = await getAllBillsCountCached();
  const billsCount = billDues.totalBillsCount;
  const startIndex = billDues.startIndex + 1;
  const { endIndex } = billDues;
  const { totalPages } = billDues;

  const hasSearchParams: boolean = isSearchParamsExist(searchParams);

  return (
    <div className={ `sticky top-[7.2rem] z-10 flex w-full flex-row items-center justify-between bg-background py-2` }>
      <div>{ `` }</div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        { hasSearchParams ?
          <>
            <Suspense fallback={ <ActionBarButtonSkeleton /> }>
              <UpcomingBillsActionBarClearAllFilters />
            </Suspense>
            <Separator orientation="vertical" className="h-[1.2rem]!" />
          </>
        : null }

        <div className="h-9">
          <UpcomingBillsTablePaginationPageCountSelect>
            <Typography>
              { startIndex } - { endIndex } of { billsCount }{ ' ' }
              { hasSearchParams ?
                <span> ({ totalBillsCount })</span>
              : null }
            </Typography>
          </UpcomingBillsTablePaginationPageCountSelect>
        </div>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
        <Suspense fallback={ <PaginationSkeleton /> }>
          <UpcomingBillsTablePaginationPageSelect pageCount={ totalPages } />
        </Suspense>
      </div>
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[120px]" />;
}

function PaginationSkeleton() {
  return <Skeleton className="h-9 w-[300px]" />;
}
