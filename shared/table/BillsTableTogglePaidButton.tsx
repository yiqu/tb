'use client';

/* eslint-disable better-tailwindcss/multiline */
import { BanknoteArrowUp } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { updateIsBillDuePaid } from '@/server/bills/bills.server';

export default function BillsTableTogglePaidButton({ billDueId, isPaid }: { billDueId: string; isPaid: boolean }) {
  const [isPending, startTransition] = useTransition();

  const [optimisticIsPaid, setOptimisticIsPaid] = useOptimistic(isPaid, (curr: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnClick = (isPaid: boolean) => {
    startTransition(async () => {
      setOptimisticIsPaid(!isPaid);
      await updateIsBillDuePaid(billDueId, !isPaid);
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={ handleOnClick.bind(null, optimisticIsPaid) }
      type="button"
      className={ cn({
        'border-1 border-green-500/20 dark:border-green-500/20': isPending,
      }) }
    >
      <BanknoteArrowUp
        className={ cn(`size-6 text-muted dark:text-gray-500/60`, {
          'text-green-600 dark:text-green-500': optimisticIsPaid,
        }) }
      />
    </Button>
  );
}
