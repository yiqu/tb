import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import BillsActionBarRefreshButton from './BillsActionBarRefreshButton';
import BillsActionBarDueDateFilter from './BillsActionBarDueDateFilter';
import BillsActionBarFrequencyFilter from './BillsActionBarFrequencyFilter';
import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilterWrapper';

export default function BillsTableActionBar() {
  return (
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
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}
