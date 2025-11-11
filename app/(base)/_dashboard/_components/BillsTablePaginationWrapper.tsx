import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import BillsTablePagination from './BillsTablePagination';

interface BillsTablePaginationWrapperProps {
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationBarStickyWrapperClassName?: string;
}

export default function BillsTablePaginationWrapper({
  searchParams,
  paginationBarStickyWrapperClassName,
}: BillsTablePaginationWrapperProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(
    SORT_DATA_PAGE_IDS.dashboard_current_month,
  );

  return (
    <Suspense fallback={ <BillsTablePaginationSkeleton /> }>
      <BillsTablePagination
        searchParamsPromise={ searchParams }
        paginationPromise={ paginationPromise }
        paginationBarStickyWrapperClassName={ paginationBarStickyWrapperClassName }
      />
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
