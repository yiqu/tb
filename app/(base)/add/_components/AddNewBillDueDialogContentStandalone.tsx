import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default async function AddNewBillDueDialogContentStandalone({
  searchParams,
}: {
  searchParams: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
}) {
  const searchParamValue = await searchParams;
  const { addBillDueSubscriptionId } = searchParamValue;

  if (!addBillDueSubscriptionId) {
    return <Loading2 />;
  }

  const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(
    addBillDueSubscriptionId ?? '',
  );

  return (
    <Suspense fallback={ <Loading /> }>
      <AddNewBillDueDialogContentFormWrapper
        subscriptionId={ addBillDueSubscriptionId }
        subscriptionPromise={ subscriptionPromise }
        key={ addBillDueSubscriptionId }
      >
        <AddNewBillDueDialogContentCard subscriptionId={ addBillDueSubscriptionId } />
        <AddNewBillDueDialogFooter />
      </AddNewBillDueDialogContentFormWrapper>
    </Suspense>
  );
}

function Loading() {
  return (
    <>
      <div className="flex h-[450px] w-full flex-col items-start justify-start gap-y-2 px-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <StyledDialogFooter />
    </>
  );
}

function Loading2() {
  return (
    <>
      <div className="flex h-[450px] w-full flex-col items-start justify-start gap-y-2 px-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <StyledDialogFooter />
    </>
  );
}
