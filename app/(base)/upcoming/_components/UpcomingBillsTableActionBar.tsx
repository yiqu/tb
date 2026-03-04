import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import LayoutContentActionBarWrapper from '@/components/layout/LayoutContentActionBarWrapper';

import UpcomingBillsActionBarRefreshButton from './UpcomingBillsActionBarRefreshButton';
import UpcomingBillsActionBarDueDateFilter from './UpcomingBillsActionBarDueDateFilter';
import UpcomingBillsActionBarFrequencyFilter from './UpcomingBillsActionBarFrequencyFilter';
import UpcomingBillsActionBarPaymentStatusFilter from './UpcomingBillsActionBarPaymentStatusFilter';
import UpcomingBillsActionBarSubscriptionFilterWrapper from './UpcomingBillsActionBarSubscriptionFilterWrapper';

function UpcomingBillsTableActionBar() {
  return (
    <LayoutContentActionBarWrapper>
      <UpcomingBillsActionBarRefreshButton />
      <Separator orientation="vertical" className="h-6!" />
      <Suspense fallback={ <ActionBarButtonSkeleton /> }>
        <UpcomingBillsActionBarSubscriptionFilterWrapper />
      </Suspense>
      <Suspense fallback={ <ActionBarButtonSkeleton /> }>
        <UpcomingBillsActionBarFrequencyFilter />
      </Suspense>
      <Separator orientation="vertical" className="h-6!" />
      <Suspense fallback={ <ActionBarButtonSkeleton /> }>
        <UpcomingBillsActionBarDueDateFilter />
      </Suspense>
      <Separator orientation="vertical" className="h-6!" />
      <Suspense fallback={ <ActionBarButtonSkeleton /> }>
        <UpcomingBillsActionBarPaymentStatusFilter />
      </Suspense>
    </LayoutContentActionBarWrapper>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const UpcomingBillsTableActionBarMemoized = memo(UpcomingBillsTableActionBar);
export default UpcomingBillsTableActionBarMemoized;
