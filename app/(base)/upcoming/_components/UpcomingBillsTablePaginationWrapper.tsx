import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import UpcomingBillsTablePagination from './UpcomingBillsTablePagination';

interface UpcomingBillsTablePaginationWrapperProps {
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function UpcomingBillsTablePaginationWrapper({ searchParams }: UpcomingBillsTablePaginationWrapperProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);

  return (
    <Suspense fallback={ <BillsTablePaginationSkeleton /> }>
      <UpcomingBillsTablePagination searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
    </Suspense>
  );
}

function BillsTablePaginationSkeleton() {
  return (
    <div className="flex h-13 w-full flex-row items-center justify-between">
      <div>{ `` }</div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        <Skeleton className="h-9 w-[500px]" />
      </div>
    </div>
  );
}
