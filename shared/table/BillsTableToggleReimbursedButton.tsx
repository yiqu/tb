'use client';

import toast from 'react-hot-toast';
import { HandCoins } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useBillStoreActions } from '@/store/bills/bills.store';
import { updateIsBillDueReimbursed } from '@/server/bills/bills.server';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

export default function BillsTableToggleReimbursedButton({
  billDueId,
  isReimbursed,
  subscriptionId,
}: {
  billDueId: string;
  isReimbursed: boolean;
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

  const [optimisticIsReimbursed, setOptimisticIsReimbursed] = useOptimistic(isReimbursed, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isReimbursed: boolean) => {
    setBillDueIdBeingEdited(billDueId);

    setPage(page);
    startTransition(async () => {
      setOptimisticIsReimbursed(!isReimbursed);
      const res = await updateIsBillDueReimbursed(billDueId, !isReimbursed, subscriptionId);
      setPage(page);
      toast.remove();
      toast.success(`${res.reimbursed ? 'Marked as reimbursed.' : 'Marked as not reimbursed.'}`);
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
      onClick={ handleOnClick.bind(null, optimisticIsReimbursed) }
      type="button"
      className={ cn('size-12', {
        'border-1 border-green-500/20 dark:border-green-500/20': isPending && optimisticIsReimbursed,
      }) }
    >
      <HandCoins
        className={ cn(`
          size-8 text-muted
          dark:text-gray-500/60
        `, {
          'text-green-600 dark:text-green-500': optimisticIsReimbursed,
        }) }
      />
    </Button>
  );
}
