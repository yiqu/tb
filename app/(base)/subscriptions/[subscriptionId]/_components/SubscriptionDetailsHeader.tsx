import Link from 'next/link';

import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import { SubscriptionDetailsHeaderActionButton } from './SubscriptionDetailsHeaderActionButton';

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
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Link href={ `/subscriptions/${subscription.id}` } prefetch>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SubscriptionLogo subscriptionName={ subscription.name } height={ 30 } />
            <Typography variant="h3">{ subscription.name }</Typography>
          </div>
        </Link>
      </div>
      <SubscriptionDetailsHeaderActionButton subscription={ subscription } />
    </div>
  );
}
