import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import BillsActionBarRefreshButton from './BillsActionBarRefreshButton';
import BillsActionBarDueDateFilter from './BillsActionBarDueDateFilter';
import BillsActionBarFrequencyFilter from './BillsActionBarFrequencyFilter';
import BillsActionBarClearAllFilters from './BillsActionBarClearAllFilters';
import BillsActionBarPaymentStatusFilter from './BillsActionBarPaymentStatusFilter';
import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilterWrapper';

function BillsTableActionBar() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
        <BillsActionBarRefreshButton />
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarSubscriptionFilter />
        </Suspense>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarFrequencyFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarDueDateFilter />
        </Suspense>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarPaymentStatusFilter />
        </Suspense>
      </div>
      <Suspense fallback={ <ActionBarButtonSkeleton /> }>
        <BillsActionBarClearAllFilters />
      </Suspense>
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const BillsTableActionBarMemoized = memo(BillsTableActionBar);
export default BillsTableActionBarMemoized;
