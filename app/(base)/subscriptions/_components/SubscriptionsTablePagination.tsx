import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';
import {
  getAllSubscriptionsCountCached,
  getAllSubscriptionsWithBillDuesPaginatedCached,
} from '@/server/subscriptions/subscriptions.server';

import { isSearchParamsExist } from './subscriptions.utils';
import SubscriptionsActionBarClearAllFilters from './SubscriptionsActionBarClearAllFilters';
import SubscriptionsTablePaginationPageSelect from './SubscriptionsTablePaginationPageSelect';
import SubscriptionsTablePaginationPageCountSelect from './SubscriptionsTablePaginationPageCountSelect';

interface SubscriptionsTablePaginationProps {
  searchParamsPromise: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function SubscriptionsTablePagination({ searchParamsPromise, paginationPromise }: SubscriptionsTablePaginationProps) {
  const pagination: PaginationDataModel | null = await paginationPromise;
  const searchParams: z.infer<typeof subscriptionSearchParamsSchema> = await searchParamsPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);
  const subscriptions: SubscriptionWithBillDuesAndSortData = await getAllSubscriptionsWithBillDuesPaginatedCached(
    sortData,
    pagination,
    searchParams,
  );
  const totalSubscriptionsCount: number = await getAllSubscriptionsCountCached();
  const subscriptionsCount = subscriptions.totalSubscriptionsCount;
  const startIndex = subscriptions.startIndex + 1;
  const { endIndex } = subscriptions;
  const { totalPages } = subscriptions;

  const hasSearchParams: boolean = isSearchParamsExist(searchParams);

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div>{ `` }</div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        { hasSearchParams ?
          <>
            <Suspense fallback={ <ActionBarButtonSkeleton /> }>
              <SubscriptionsActionBarClearAllFilters />
            </Suspense>
            <Separator orientation="vertical" className="h-[1.2rem]!" />
          </>
        : null }

        <div>
          <SubscriptionsTablePaginationPageCountSelect>
            <Typography>
              { startIndex } - { endIndex } of { subscriptionsCount }{ ' ' }
              { hasSearchParams ?
                <span> ({ totalSubscriptionsCount })</span>
              : null }
            </Typography>
          </SubscriptionsTablePaginationPageCountSelect>
        </div>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
        <Suspense fallback={ <PaginationSkeleton /> }>
          <SubscriptionsTablePaginationPageSelect pageCount={ totalPages } />
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
