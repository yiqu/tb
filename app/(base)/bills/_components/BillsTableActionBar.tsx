import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import LayoutContentActionBarWrapper from '@/components/layout/LayoutContentActionBarWrapper';

import BillsActionBarRefreshButton from './BillsActionBarRefreshButton';
import BillsActionBarDueDateFilter from './BillsActionBarDueDateFilter';
import BillsActionBarFrequencyFilter from './BillsActionBarFrequencyFilter';
import BillsActionBarPaymentStatusFilter from './BillsActionBarPaymentStatusFilter';
import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilterWrapper';

function BillsTableActionBar() {
  return (
    <LayoutContentActionBarWrapper>
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
    </LayoutContentActionBarWrapper>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const BillsTableActionBarMemoized = memo(BillsTableActionBar);
export default BillsTableActionBarMemoized;
