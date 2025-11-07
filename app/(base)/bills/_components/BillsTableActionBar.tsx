import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ContentActionBarStickyWrapper from '@/components/layout/ContentActionBarStickyWrapper';

import BillsActionBarRefreshButton from './BillsActionBarRefreshButton';
import BillsActionBarDueDateFilter from './BillsActionBarDueDateFilter';
import BillsActionBarFrequencyFilter from './BillsActionBarFrequencyFilter';
import BillsActionBarPaymentStatusFilter from './BillsActionBarPaymentStatusFilter';
import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilterWrapper';

function BillsTableActionBar() {
  return (
    <ContentActionBarStickyWrapper>
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
        <BillsActionBarRefreshButton />
        <Separator orientation="vertical" className="h-6!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarSubscriptionFilter />
        </Suspense>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarFrequencyFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-6!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarDueDateFilter />
        </Suspense>
        <Separator orientation="vertical" className="h-6!" />
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarPaymentStatusFilter />
        </Suspense>
      </div>
    </ContentActionBarStickyWrapper>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const BillsTableActionBarMemoized = memo(BillsTableActionBar);
export default BillsTableActionBarMemoized;
