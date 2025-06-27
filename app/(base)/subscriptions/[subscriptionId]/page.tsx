import { Suspense } from 'react';

import SubscriptionDetailsParent from './_components/SubscriptionDetailsParent';

interface SubscriptionDetailsPageProps {
  params: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailsPage({ params }: SubscriptionDetailsPageProps) {
  return (
    <Suspense fallback={ <div>Loading...</div> }>
      <SubscriptionDetailsParent paramsPromise={ params } />
    </Suspense>
  );
}
