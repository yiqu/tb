import { Suspense } from 'react';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogWrapper from './AddNewBillDueDialogWrapper';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default function AddNewBillDueDialog({ subscriptionId }: { subscriptionId: string }) {
  const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(subscriptionId);

  return (
    <AddNewBillDueDialogWrapper>
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
