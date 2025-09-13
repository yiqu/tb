'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

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

  if (isLoading) {
    return null;
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
  return <div>Loading add new bill due dialog...</div>;
}
