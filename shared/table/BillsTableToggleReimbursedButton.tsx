'use client';

import toast from 'react-hot-toast';
/* eslint-disable better-tailwindcss/multiline */
import { BanknoteArrowDown } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { updateIsBillDueReimbursed } from '@/server/bills/bills.server';

export default function BillsTableToggleReimbursedButton({ billDueId, isReimbursed }: { billDueId: string; isReimbursed: boolean }) {
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
    setPage(page);
    startTransition(async () => {
      setOptimisticIsReimbursed(!isReimbursed);
      const res = await updateIsBillDueReimbursed(billDueId, !isReimbursed);
      setPage(page);
      toast.success(`${res.reimbursed ? 'Marked as reimbursed.' : 'Marked as not reimbursed.'}`);
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
      <BanknoteArrowDown
        className={ cn(`size-10 text-muted dark:text-gray-500/60`, {
          'text-green-600 dark:text-green-500': optimisticIsReimbursed,
        }) }
      />
    </Button>
  );
}
