'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import ErrorCard from '@/components/status-cards/ErrorCard';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import AddNewBillDueDialogFooter from './AddNewBillDueDialogFooter';
import AddNewBillDueDialogWrapper from './AddNewBillDueDialogWrapper';
import AddNewBillDueDialogContentCard from './AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from './AddNewBillDueDialogContentFormWrapper';

export default function AddNewBillDueDialog({ subscriptionId }: { subscriptionId: string }) {
  // const subscriptionPromise: Promise<SubscriptionWithBillDues | null> = getSubscriptionWithBillDuesByIdCached(subscriptionId);
  const { data, isLoading, isError, error } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId),
    enabled: !!subscriptionId,
  });

  if (isLoading) {
    return <Loading />;
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
  return <div>Loading...</div>;
}
