'use client';

import toast from 'react-hot-toast';
import { BanknoteArrowUp } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useBillStoreActions } from '@/store/bills/bills.store';
import { updateIsBillDuePaid } from '@/server/bills/bills.server';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

export default function BillsTableTogglePaidButton({
  billDueId,
  isPaid,
  subscriptionId,
}: {
  billDueId: string;
  isPaid: boolean;
  subscriptionId: string;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const { setBillDueIdBeingEdited, setLastEditedTimestamp } = useBillStoreActions();

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false,
      })
      .withDefault(1),
  );

  const [optimisticIsPaid, setOptimisticIsPaid] = useOptimistic(isPaid, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isPaid: boolean) => {
    setBillDueIdBeingEdited(billDueId);

    setPage(page);
    startTransition(async () => {
      setOptimisticIsPaid(!isPaid);
      const res = await updateIsBillDuePaid(billDueId, !isPaid, subscriptionId);
      setPage(page);
      toast.remove();
      toast.success(`${res.paid ? 'Marked as paid.' : 'Marked as unpaid.'}`);
      setBillDueIdBeingEdited(billDueId, true);
      setLastEditedTimestamp(Date.now());
      queryClient.invalidateQueries({
        queryKey: [
          TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
          {
            [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: billDueId,
          },
        ],
      });
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={ handleOnClick.bind(null, optimisticIsPaid) }
      type="button"
      className={ cn('size-12', {
        'border-1 border-green-500/20 dark:border-green-500/20': isPending && optimisticIsPaid,
      }) }
    >
      <BanknoteArrowUp
        className={ cn(`
          size-8 text-muted
          dark:text-gray-500/60
        `, {
          'text-green-600 dark:text-green-500': optimisticIsPaid,
        }) }
      />
    </Button>
  );
}
