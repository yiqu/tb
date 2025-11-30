import { memo, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ContentActionBarStickyWrapper from '@/components/layout/ContentActionBarStickyWrapper';

import SubscriptionsActionBarActionsMenu from './SubscriptionsActionBarActionsMenu';
import BillsActionBarDueDateFilterParent from './BillsActionBarDueDateFilterParent';
import SubscriptionsActionBarRefreshButton from './SubscriptionsActionBarRefreshButton';
import SubscriptionsActionBarFrequencyFilter from './SubscriptionsActionBarFrequencyFilter';
import SubscriptionsActionBarSubscriptionFilterWrapper from './SubscriptionsActionBarSubscriptionFilterWrapper';

const showDeleteAllSubscriptionsOption: boolean = process.env.APP_SHOW_DELETE_ALL_SUBSCRIPTIONS === 'true';

function SubscriptionsTableActionBar() {
  return (
    <ContentActionBarStickyWrapper>
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2">
          <SubscriptionsActionBarRefreshButton />
          <Separator orientation="vertical" className="h-6!" />
          <Suspense fallback={ <ActionBarButtonSkeleton /> }>
            <SubscriptionsActionBarSubscriptionFilterWrapper />
          </Suspense>
          <Suspense fallback={ <ActionBarButtonSkeleton /> }>
            <SubscriptionsActionBarFrequencyFilter />
          </Suspense>
          <BillsActionBarDueDateFilterParent />
        </div>

        <SubscriptionsActionBarActionsMenu showDeleteAllSubscriptionsOption={ showDeleteAllSubscriptionsOption } />
      </div>
    </ContentActionBarStickyWrapper>
  );
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[240px]" />;
}

const SubscriptionsTableActionBarMemoized = memo(SubscriptionsTableActionBar);
export default SubscriptionsTableActionBarMemoized;
