import { Suspense } from 'react';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import EditSubscriptionDialogFooter from './EditSubscriptionDialogFooter';
import EditSubscriptionDialogWrapper from './EditSubscriptionDialogWrapper';
import EditSubscriptionDialogContentCard from './EditSubscriptionDialogContentCard';
import EditSubscriptionDialogContentFormWrapper from './EditSubscriptionDialogContentFormWrapper';

export default function EditSubscriptionDialog({ subscriptionId }: { subscriptionId: string }) {
  const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(subscriptionId);

  return (
    <EditSubscriptionDialogWrapper>
      <Suspense fallback={ <Loading /> }>
        <EditSubscriptionDialogContentFormWrapper subscriptionId={ subscriptionId } subscriptionPromise={ subscriptionPromise }>
          <EditSubscriptionDialogContentCard />
          <EditSubscriptionDialogFooter />
        </EditSubscriptionDialogContentFormWrapper>
      </Suspense>
    </EditSubscriptionDialogWrapper>
  );
}

function Loading() {
  return <div>Loading...</div>;
}
