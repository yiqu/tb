'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';

import ErrorCard from '@/components/status-cards/ErrorCard';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';

import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogWrapper from './AddNewBillDueDialogWrapper';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default function AddNewBillDueDialog({ subscriptionId }: { subscriptionId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId),
    enabled: !!subscriptionId,
  });

  // Show the loading state inside the dialog. The wrapper renders nothing until the dialog is opened, so a
  // closed dialog no longer puts a large skeleton under the page (which also caused a hydration mismatch).
  if (isLoading) {
    return (
      <AddNewBillDueDialogWrapper>
        <Loading />
      </AddNewBillDueDialogWrapper>
    );
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
    <AddNewBillDueDialogWrapper>
      <Suspense fallback={ <Loading /> }>
        <AddNewBillDueDialogContentFormWrapper subscriptionId={ subscriptionId } subscription={ data }>
          <AddNewBillDueDialogContentCard subscription={ data } />
          <AddNewBillDueDialogFooter />
        </AddNewBillDueDialogContentFormWrapper>
      </Suspense>
    </AddNewBillDueDialogWrapper>
  );
}

function Loading() {
  return <Skeleton className="h-100 w-full" />;
}
