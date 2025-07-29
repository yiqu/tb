'use client';

import toast from 'react-hot-toast';
import { HandCoins } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import billsTableViewStore from '@/store/bills/bills.store';
import { updateIsBillDueReimbursed } from '@/server/bills/bills.server';

export default function BillsTableToggleReimbursedButton({
  billDueId,
  isReimbursed,
  subscriptionId,
}: {
  billDueId: string;
  isReimbursed: boolean;
  subscriptionId: string;
}) {
  const setBillDueIdBeingEdited = billsTableViewStore.use.setBillDueIdBeingEdited();
  const setLastEdited = billsTableViewStore.use.setLastEdited();
  const clearBillDueIdBeingEdited = billsTableViewStore.use.clearBillDueIdBeingEdited();

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false,
      })
      .withDefault(1),
  );
  const [isPending, startTransition] = useTransition();

  const [optimisticIsReimbursed, setOptimisticIsReimbursed] = useOptimistic(isReimbursed, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isReimbursed: boolean) => {
    setBillDueIdBeingEdited(billDueId);
    setLastEdited(Date.now());

    setPage(page);
    startTransition(async () => {
      setOptimisticIsReimbursed(!isReimbursed);
      const res = await updateIsBillDueReimbursed(billDueId, !isReimbursed, subscriptionId);
      setPage(page);
      toast.remove();
      toast.success(`${res.reimbursed ? 'Marked as reimbursed.' : 'Marked as not reimbursed.'}`);
      clearBillDueIdBeingEdited(billDueId);
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
