import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import LinkAnimated from '@/shared/components/LinkAnimated';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { getSubscriptionDetailsHeaderLogoSize } from '@/shared/table/table.utils';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsHeaderFavoriteName from './SubscriptionDetailsHeaderFavoriteName';
import { SubscriptionDetailsHeaderActionButton } from './SubscriptionDetailsHeaderActionButton';
import SubscriptionDetailsHeaderFavoriteToggleButtonParent from './SubscriptionDetailsHeaderFavoriteToggleButtonParent';

export default async function SubscriptionDetailsHeader({
  subscriptionPromise,
}: {
  subscriptionPromise: Promise<{ subscriptionId: string }>;
}) {
  const subscriptionParams = await subscriptionPromise;
  const { subscriptionId } = subscriptionParams;

  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId);

  if (!subscription) {
    return null;
  }

  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="flex flex-row items-center justify-start gap-x-2">
        <LinkAnimated
          label={ subscription.name }
          href={ `/subscriptions/${subscription.id}` }
          prefetch
          startAdornment={
            <SubscriptionLogo subscriptionName={ subscription.name } height={ getSubscriptionDetailsHeaderLogoSize(subscription.name) } />
          }
          textClassName="h3"
        />
        <Suspense fallback={ <Loading /> }>
          <SubscriptionDetailsHeaderFavoriteName subscriptionId={ subscription.id } />
        </Suspense>
      </div>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <SubscriptionDetailsHeaderFavoriteToggleButtonParent subscription={ subscription } />
        <SubscriptionDetailsHeaderActionButton subscription={ subscription } />
      </div>
    </div>
  );
}

function Loading() {
  return <Skeleton className="h-8 w-[300px]" />;
}
