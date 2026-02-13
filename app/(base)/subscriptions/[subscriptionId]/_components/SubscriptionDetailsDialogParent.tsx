'use client';

import { useQueryState } from 'nuqs';
import { use, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import ColumnStack from '@/shared/components/ColumnStack';
import EditBillForm from '@/components/bills/EditBillForm';
import Typography from '@/components/typography/Typography';
import ErrorCard from '@/components/status-cards/ErrorCard';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import BillsTableActionDialog from '@/app/(base)/bills/_components/BillsTableActionDialog';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import { SUBSCRIPTION_DETAILS_DIALOG_ID } from './utils';
import SubscriptionDetailsMetadata from './SubscriptionDetailsMetadata';
import SubscriptionDetailsDialogBillsTableParentParent from './SubscriptionDetailsDialogBillsTableParentParent';

export default function SubscriptionDetailsDialogParent() {
  const [subscriptionId] = useQueryState(SUBSCRIPTION_DETAILS_DIALOG_ID);
  const { data, isLoading, isError, error } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId ?? ''),
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

  if (!subscriptionId) {
    return <NoResultsCard titleText="Subscription not found">Subscription ID not found</NoResultsCard>;
  }

  return (
    <ColumnStack className="mb-4 w-full">
      <ColumnStack className="w-full gap-y-6">
        <SubscriptionDetailsMetadata subscription={ data } />
        { /* <SubscriptionDetailsDialogBillsTableParentParent subscriptionId={ subscriptionId ?? '' } subscription={ subscription } /> */ }
      </ColumnStack>
      { /* <BillsTableActionDialog>
        <EditBillForm />
      </BillsTableActionDialog> */ }
      { /* <AddNewBillDueDialog subscriptionId={ subscriptionId } />
      <EditSubscriptionDialog subscriptionId={ subscriptionId } /> */ }
    </ColumnStack>
  );
}

function TableLoading() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-6">
      <Typography variant="h3">Bill Dues</Typography>
      <Skeleton className="h-200 w-full" />
    </div>
  );
}

function Loading() {
  return (
    <ColumnStack className="w-full gap-y-6">
      <Skeleton className="h-100 w-full" />
      <Skeleton className="h-50 w-full" />
    </ColumnStack>
  );
}
