'use client';

import toast from 'react-hot-toast';
import { CircleCheck } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSubscriptionStoreActions } from '@/store/subscriptions/subscriptions.store';
import { updateIsSubscriptionApproved } from '@/server/subscriptions/subscriptions.server';

export default function SubscriptionsTableToggleApprovedButton({
  subscriptionId,
  isApproved,
}: {
  subscriptionId: string;
  isApproved: boolean;
}) {
  const { setSubscriptionIdBeingEdited, setLastEdited } = useSubscriptionStoreActions();

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false,
      })
      .withDefault(1),
  );

  const [isPending, startTransition] = useTransition();

  const [optimisticIsApproved, setOptimisticIsApproved] = useOptimistic(isApproved, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isApproved: boolean) => {
    setSubscriptionIdBeingEdited(subscriptionId);
    setLastEdited(Date.now());

    setPage(page);
    startTransition(async () => {
      setOptimisticIsApproved(!isApproved);
      const res = await updateIsSubscriptionApproved(subscriptionId, !isApproved);
      setPage(page);
      toast.remove();
      toast.success(`${res.approved ? 'Marked as approved.' : 'Marked as unapproved.'}`);
      setSubscriptionIdBeingEdited(subscriptionId, true);
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={ handleOnClick.bind(null, optimisticIsApproved) }
      type="button"
      className={ cn('size-12', {
        'border-1 border-green-500/20 dark:border-green-500/20': isPending && optimisticIsApproved,
      }) }
    >
      <CircleCheck
        className={ cn(`
          size-8 text-muted
          dark:text-gray-500/60
        `, {
          'text-green-600 dark:text-green-500': optimisticIsApproved,
        }) }
      />
    </Button>
  );
}
