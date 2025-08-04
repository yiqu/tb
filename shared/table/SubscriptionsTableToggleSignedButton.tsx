'use client';

import toast from 'react-hot-toast';
import { PenLine } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import subscriptionsTableViewStore from '@/store/subscriptions/subscriptions.store';
import { updateIsSubscriptionSigned } from '@/server/subscriptions/subscriptions.server';

export default function SubscriptionsTableToggleSignedButton({ subscriptionId, isSigned }: { subscriptionId: string; isSigned: boolean }) {
  const setSubscriptionIdBeingEdited = subscriptionsTableViewStore.use.setSubscriptionIdBeingEdited();
  const setLastEdited = subscriptionsTableViewStore.use.setLastEdited();
  const clearSubscriptionIdBeingEdited = subscriptionsTableViewStore.use.clearSubscriptionIdBeingEdited();

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false,
      })
      .withDefault(1),
  );

  const [isPending, startTransition] = useTransition();

  const [optimisticIsSigned, setOptimisticIsSigned] = useOptimistic(isSigned, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isSigned: boolean) => {
    setSubscriptionIdBeingEdited(subscriptionId);
    setLastEdited(Date.now());

    setPage(page);
    startTransition(async () => {
      setOptimisticIsSigned(!isSigned);
      const res = await updateIsSubscriptionSigned(subscriptionId, !isSigned);
      setPage(page);
      toast.remove();
      toast.success(`${res.signed ? 'Marked as signed.' : 'Marked as unsigned.'}`);
      clearSubscriptionIdBeingEdited(subscriptionId);
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={ handleOnClick.bind(null, optimisticIsSigned) }
      type="button"
      className={ cn('size-12', {
        'border-1 border-green-500/20 dark:border-green-500/20': isPending && optimisticIsSigned,
      }) }
    >
      <PenLine
        className={ cn(`
          size-8 text-muted
          dark:text-gray-500/60
        `, {
          'text-green-600 dark:text-green-500': optimisticIsSigned,
        }) }
      />
    </Button>
  );
}
