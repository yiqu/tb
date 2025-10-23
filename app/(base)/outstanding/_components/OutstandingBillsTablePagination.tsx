import z from 'zod';
import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getAllBillsCountCached, getAllOutstandingBillsCached } from '@/server/bills/bills.server';

import { isSearchParamsExist } from './bills.utils';
import OutstandingBillsActionBarClearAllFilters from './OutstandingBillsActionBarClearAllFilters';
import OutstandingBillsTablePaginationPageSelect from './OutstandingBillsTablePaginationPageSelect';
import OutstandingBillsTablePaginationPageCountSelect from './OutstandingBillsTablePaginationPageCountSelect';

interface OutstandingBillsTablePaginationProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function OutstandingBillsTablePagination({
  searchParamsPromise,
  paginationPromise,
}: OutstandingBillsTablePaginationProps) {
  'use cache';
  cacheLife('days');

  const pagination: PaginationDataModel | null = await paginationPromise;
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllOutstandingBillsCached(sortData, pagination, searchParams);
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
              <OutstandingBillsActionBarClearAllFilters />
            </Suspense>
            <Separator orientation="vertical" className="h-[1.2rem]!" />
          </>
        : null }

        <div className="h-9">
          <OutstandingBillsTablePaginationPageCountSelect>
            <Typography>
              { startIndex } - { endIndex } of { billsCount }{ ' ' }
              { hasSearchParams ?
                <span> ({ totalBillsCount })</span>
              : null }
            </Typography>
          </OutstandingBillsTablePaginationPageCountSelect>
        </div>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
        <Suspense fallback={ <PaginationSkeleton /> }>
          <OutstandingBillsTablePaginationPageSelect pageCount={ totalPages } />
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
