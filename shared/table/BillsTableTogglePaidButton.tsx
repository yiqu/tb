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
import {
  TANSTACK_QUERY_QUERY_KEY_ID_GENERAL,
  TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
  TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
  TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS_ID,
} from '@/constants/constants';

export default function BillsTableTogglePaidButton({
  billDueId,
  isPaid,
  subscriptionId,
  btnClassName,
  btnIconClassName,
  favoriteEntityId,
}: {
  billDueId: string;
  isPaid: boolean;
  subscriptionId: string;
  btnClassName?: string;
  btnIconClassName?: string;
  favoriteEntityId?: string;
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
      queryClient.invalidateQueries({
        queryKey: [
          TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
          {
            [TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS_ID]: favoriteEntityId,
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
      className={ cn(
        'size-12',
        {
          'border border-green-500/20 dark:border-green-500/20': isPending && optimisticIsPaid,
        },
        btnClassName,
      ) }
    >
      <BanknoteArrowUp
        className={ cn(`
          size-8 text-muted
          dark:text-gray-500/60
        `, btnIconClassName, {
          'text-green-600 dark:text-green-500': optimisticIsPaid,
        }) }
      />
    </Button>
  );
}
