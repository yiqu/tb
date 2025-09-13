import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { FavoriteEntityResponse } from '@/models/favorites/favorite.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getIsFavoriteByEntityTypeAndIdCached } from '@/server/favorites/favorites.server';

import SubscriptionDetailsHeaderFavoriteToggleButton from './SubscriptionDetailsHeaderFavoriteToggleButton';

export default function SubscriptionDetailsHeaderFavoriteToggleButtonParent({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const isFavoriteEntityPromise: Promise<z.infer<typeof FavoriteEntityResponse> | null> = getIsFavoriteByEntityTypeAndIdCached(
    'SUBSCRIPTION',
    subscription.id,
  );

  return (
    <Suspense fallback={ <Loading /> }>
      <SubscriptionDetailsHeaderFavoriteToggleButton
        isFavoriteEntityPromise={ isFavoriteEntityPromise }
        subscription={ subscription }
        type="SUBSCRIPTION"
      />
    </Suspense>
  );
}

function Loading() {
  return <Skeleton className="h-9 w-[100px]" />;
}
