import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import OutstandingBillsTablePagination from './OutstandingBillsTablePagination';

interface OutstandingBillsTablePaginationWrapperProps {
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function OutstandingBillsTablePaginationWrapper({ searchParams }: OutstandingBillsTablePaginationWrapperProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);

  return (
    <Suspense fallback={ <BillsTablePaginationSkeleton /> }>
      <OutstandingBillsTablePagination searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
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
