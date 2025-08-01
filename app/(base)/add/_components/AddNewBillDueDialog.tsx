import { Suspense } from 'react';

import { Separator } from '@/components/ui/separator';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import AddNewBillDueDialogTitle from './AddNewBillDueDialogTitle';
import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogWrapper from './AddNewBillDueDialogWrapper';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default function AddNewBillDueDialog({ subscriptionId }: { subscriptionId: string }) {
  const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(subscriptionId);

  return (
    <AddNewBillDueDialogWrapper>
      <AddNewBillDueDialogTitle />
      <Separator />
      <Suspense fallback={ <Loading /> }>
        <AddNewBillDueDialogContentFormWrapper subscriptionId={ subscriptionId } subscriptionPromise={ subscriptionPromise }>
          <AddNewBillDueDialogContentCard />
          <AddNewBillDueDialogFooter />
        </AddNewBillDueDialogContentFormWrapper>
      </Suspense>
    </AddNewBillDueDialogWrapper>
  );
}

function Loading() {
  return <div>Loading...</div>;
}
