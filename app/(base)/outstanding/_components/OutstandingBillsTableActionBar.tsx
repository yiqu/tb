import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import OutstandingBillsActionBarDueDateFilter from './OutstandingBillsActionBarDueDateFilter';
import OutstandingBillsActionBarRefreshButton from './OutstandingBillsActionBarRefreshButton';
import OutstandingBillsActionBarFrequencyFilter from './OutstandingBillsActionBarFrequencyFilter';
import OutstandingBillsActionBarPaymentStatusFilter from './OutstandingBillsActionBarPaymentStatusFilter';
import OutstandingBillsActionBarSubscriptionFilterWrapper from './OutstandingBillsActionBarSubscriptionFilterWrapper';

function OutstandingBillsTableActionBar() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
        <OutstandingBillsActionBarRefreshButton />
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <OutstandingBillsActionBarSubscriptionFilterWrapper />
        </Suspense>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <OutstandingBillsActionBarFrequencyFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <OutstandingBillsActionBarDueDateFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <OutstandingBillsActionBarPaymentStatusFilter />
        </Suspense>
      </div>
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const OutstandingBillsTableActionBarMemoized = memo(OutstandingBillsTableActionBar);
export default OutstandingBillsTableActionBarMemoized;
