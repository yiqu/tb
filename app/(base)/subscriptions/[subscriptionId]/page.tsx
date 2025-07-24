import { Suspense } from 'react';

import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsBareCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsParent from './_components/SubscriptionDetailsParent';

export const dynamicParams = true;
interface SubscriptionDetailsPageProps {
  params: Promise<{ subscriptionId: string }>;
}

// Return a list of `params` to populate the [subscriptionId] dynamic segment
export async function generateStaticParams() {
  const subscriptions: SubscriptionOriginal[] = await getAllSubscriptionsBareCached();

  return subscriptions.map((subscription) => ({
    subscriptionId: subscription.id,
  }));
}

export default async function SubscriptionDetailsPage({ params }: SubscriptionDetailsPageProps) {
  return (
    <Suspense fallback={ <div>Loading...</div> }>
      <SubscriptionDetailsParent paramsPromise={ params } />
    </Suspense>
  );
}
