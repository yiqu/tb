import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import UpcomingBillsActionBarRefreshButton from './UpcomingBillsActionBarRefreshButton';
import UpcomingBillsActionBarDueDateFilter from './UpcomingBillsActionBarDueDateFilter';
import UpcomingBillsActionBarFrequencyFilter from './UpcomingBillsActionBarFrequencyFilter';
import UpcomingBillsActionBarPaymentStatusFilter from './UpcomingBillsActionBarPaymentStatusFilter';
import UpcomingBillsActionBarSubscriptionFilterWrapper from './UpcomingBillsActionBarSubscriptionFilterWrapper';

function UpcomingBillsTableActionBar() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
        <UpcomingBillsActionBarRefreshButton />
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <UpcomingBillsActionBarSubscriptionFilterWrapper />
        </Suspense>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <UpcomingBillsActionBarFrequencyFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <UpcomingBillsActionBarDueDateFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.5rem]!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <UpcomingBillsActionBarPaymentStatusFilter />
        </Suspense>
      </div>
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const UpcomingBillsTableActionBarMemoized = memo(UpcomingBillsTableActionBar);
export default UpcomingBillsTableActionBarMemoized;
