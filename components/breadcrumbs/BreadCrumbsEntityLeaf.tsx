'use client';

import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';

import { Skeleton } from '../ui/skeleton';
import Typography from '../typography/Typography';

export default function BreadCrumbsEntityLeaf({ paths, path, isLast }: { paths: string[]; path: string; isLast?: boolean }) {
  const isPathSubscription = paths.includes('subscriptions');
  const isPathBills = paths.includes('bills');
  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
    isError: isSubscriptionError,
  } = useQuery({
    ...getSubscriptionByIdQueryOptions(path),
    enabled: !!isPathSubscription,
  });
  const {
    data: billData,
    isLoading: isBillLoading,
    isError: isBillError,
  } = useQuery({
    ...getBillDueByIdQueryOptions(path),
    enabled: !!isPathBills,
  });
  if (paths.includes('subscriptions')) {
    if (isSubscriptionLoading) {
      return <Skeleton className="h-4 w-30" />;
    }

    if (isSubscriptionError) {
      return <Typography className="text-muted-foreground">Could not load subscription</Typography>;
    }
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        { subscriptionData?.name ?? path }
      </Typography>
    );
  }

  if (paths.includes('bills')) {
    const dueDate = DateTime.fromMillis(Number.parseInt(billData?.dueDate ?? '0'))
      .setZone(EST_TIME_ZONE)
      .toLocaleString(DateTime.DATETIME_SHORT);
    const displayText = `${billData?.subscription.name} - ${billData?.cost ? `$${billData?.cost}` : 'Could not load cost'} - ${dueDate}`;

    if (isBillLoading) {
      return <Skeleton className="h-4 w-[218px]" />;
    }

    if (isBillError) {
      return <Typography className="text-muted-foreground">Could not load bill</Typography>;
    }

    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        { displayText }
      </Typography>
    );
  }

  return (
    <Typography
      className={ cn({
        'text-muted-foreground': isLast,
      }) }
    >
      { path }
    </Typography>
  );
}
