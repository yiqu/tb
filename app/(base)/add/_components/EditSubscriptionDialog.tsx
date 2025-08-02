import { Suspense } from 'react';

import { Separator } from '@/components/ui/separator';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import EditSubscriptionDialogTitle from './EditSubscriptionDialogTitle';
import EditSubscriptionDialogFooter from './EditSubscriptionDialogFooter';
import EditSubscriptionDialogWrapper from './EditSubscriptionDialogWrapper';
import EditSubscriptionDialogContentCard from './EditSubscriptionDialogContentCard';
import EditSubscriptionDialogContentFormWrapper from './EditSubscriptionDialogContentFormWrapper';

export default function EditSubscriptionDialog({ subscriptionId }: { subscriptionId: string }) {
  const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(subscriptionId);

  return (
    <EditSubscriptionDialogWrapper>
      <EditSubscriptionDialogTitle />
      <Separator />
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
