import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import SubscriptionsActionBarActionsMenu from './SubscriptionsActionBarActionsMenu';
import SubscriptionsActionBarRefreshButton from './SubscriptionsActionBarRefreshButton';
import SubscriptionsActionBarFrequencyFilter from './SubscriptionsActionBarFrequencyFilter';
import SubscriptionsActionBarSubscriptionFilterWrapper from './SubscriptionsActionBarSubscriptionFilterWrapper';

function SubscriptionsTableActionBar() {
  return (
    <div className="sticky top-[4rem] z-50 flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2 bg-background py-2">
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
          <SubscriptionsActionBarRefreshButton />
          <Separator orientation="vertical" className="h-[1.5rem]!" />
          <Suspense fallback={ <ActionBarButtonSkeleton /> }>
            <SubscriptionsActionBarSubscriptionFilterWrapper />
          </Suspense>
          <Suspense fallback={ <ActionBarButtonSkeleton /> }>
            <SubscriptionsActionBarFrequencyFilter />
          </Suspense>
        </div>

        <SubscriptionsActionBarActionsMenu />
      </div>
    </div>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const SubscriptionsTableActionBarMemoized = memo(SubscriptionsTableActionBar);
export default SubscriptionsTableActionBarMemoized;
