'use client';

import { ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS } from '@/constants/constants';

import { Alert } from '../alerts/Alert';
import { Skeleton } from '../ui/skeleton';
import Typography from '../typography/Typography';
import EditSubscriptionDialogContentFooter from './EditSubscriptionDialogContentFooter';
import EditSubscriptionDialogContentFormWrapper from './EditSubscriptionDialogContentFormWrapper';

export default function EditSubscriptionDialogContent({ subscriptionId, children }: { subscriptionId: string; children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoading, isError, error, data, isFetching, dataUpdatedAt } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId),
  });

  const isSubscriptionLoaded: boolean = !!(!isLoading && data && !isError);
  const isSubscriptionLoading: boolean = isLoading || isFetching;

  const handleOnRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: [
        TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS,
        {
          [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: subscriptionId,
        },
      ],
    });
  };

  return (
    <StyledDialogContent
      headerTitle="Edit Subscription"
      headerDescription={
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center justify-start gap-x-1">
            <Typography>Make changes to your subscription.</Typography>
            <Button variant="ghost" size="icon" onClick={ handleOnRefetch }>
              <RefreshCcw className={ cn({ 'animate-spin': isFetching }) } />
            </Button>
          </div>
          <div className="flex flex-row items-center justify-end gap-x-2">
            { data ?
              <DateRelativeDisplay time={ `${data?.updatedAt}` } includeParenthesis={ false } prefixText="Last updated:" />
            : null }
          </div>
        </div>
      }
    >
      { isError ?
        <div className="flex w-full flex-col">
          <Alert description={ <Typography>{ error.message }</Typography> } variant="danger" />
        </div>
      : null }
      { isSubscriptionLoaded && data ?
        <EditSubscriptionDialogContentFormWrapper subscriptionId={ subscriptionId } subscription={ data } key={ `${dataUpdatedAt}` }>
          <div className="px-4">{ children }</div>
          <EditSubscriptionDialogContentFooter isDataLoading={ isSubscriptionLoading } />
        </EditSubscriptionDialogContentFormWrapper>
      : <div className="mb-4 flex flex-col justify-start gap-y-4 px-4">
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[10.5rem] w-full" />
      </div>
      }
    </StyledDialogContent>
  );
}
