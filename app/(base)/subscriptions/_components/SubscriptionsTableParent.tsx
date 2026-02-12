import z from 'zod';

import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsWithBillDuesPaginatedCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionsTableParentWrapper from './SubscriptionsTableParentWrapper';

interface SubscriptionsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function SubscriptionsTableParent({ searchParamsPromise, paginationPromise }: SubscriptionsTableParentProps) {
  const searchParams: z.infer<typeof subscriptionSearchParamsSchema> = await searchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);
  const subscriptions: SubscriptionWithBillDuesAndSortData = await getAllSubscriptionsWithBillDuesPaginatedCached(
    sortData,
    pagination,
    searchParams,
  );

  if (subscriptions.subscriptions.length === 0) {
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-2">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
      </div>
    );
  }

  return (
    <DisplayCard className="w-full py-0 shadow-none">
      <CardContent className="overflow-x-auto p-2">
        <SubscriptionsTableParentWrapper subscriptions={ subscriptions } />
      </CardContent>
    </DisplayCard>
  );
}
