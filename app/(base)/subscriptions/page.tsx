import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import SubscriptionsTableParent from './_components/SubscriptionsTableParent';
import SubscriptionsTableSkeleton from './_components/SubscriptionsTableSkeleton';
import SubscriptionsTableActionBar from './_components/SubscriptionsTableActionBar';
import SubscriptionsTablePaginationWrapper from './_components/SubscriptionsTablePaginationWrapper';

interface SubscriptionsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
}

export default function SubscriptionsPage({ searchParams }: SubscriptionsPageProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <SubscriptionsTableActionBar />
      <SubscriptionsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <SubscriptionsTableSkeleton /> }>
        <SubscriptionsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
        { /* <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog> */ }
      </Suspense>
    </div>
  );
}
