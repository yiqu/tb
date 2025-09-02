'use client';

import z from 'zod';
import { use, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import ErrorCard from '@/components/status-cards/ErrorCard';
import Typography from '@/components/typography/Typography';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default function AddNewBillDueDialogContentStandalone({
  searchParams,
}: {
  searchParams: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
}) {
  const searchParamValue = use(searchParams);
  const { addBillDueSubscriptionId } = searchParamValue;
  const { data, isLoading, isError, error } = useQuery({
    ...getSubscriptionByIdQueryOptions(addBillDueSubscriptionId ?? ''),
    enabled: !!addBillDueSubscriptionId,
  });

  if (isLoading || !addBillDueSubscriptionId) {
    return <Loading2 />;
  }

  if (!data) {
    return null;
  }

  if (isError) {
    return (
      <ErrorCard blendBg={ true } blendTextAreaBorder={ true }>
        { error.message }
      </ErrorCard>
    );
  }

  return (
    <Suspense fallback={ <Loading /> }>
      <AddNewBillDueDialogContentFormWrapper subscriptionId={ addBillDueSubscriptionId } subscription={ data } key={ addBillDueSubscriptionId }>
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
        <Typography>Missing subscription ID</Typography>
      </div>
      <StyledDialogFooter />
    </>
  );
}
