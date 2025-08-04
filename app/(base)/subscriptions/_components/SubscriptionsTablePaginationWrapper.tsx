import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import SubscriptionsTablePagination from './SubscriptionsTablePagination';

interface SubscriptionsTablePaginationWrapperProps {
  searchParams: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
}

export default function SubscriptionsTablePaginationWrapper({ searchParams }: SubscriptionsTablePaginationWrapperProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);

  return (
    <Suspense fallback={ <SubscriptionsTablePaginationSkeleton /> }>
      <SubscriptionsTablePagination searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
    </Suspense>
  );
}

function SubscriptionsTablePaginationSkeleton() {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div>{ `` }</div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        <Skeleton className="h-9 w-[500px]" />
      </div>
    </div>
  );
}
