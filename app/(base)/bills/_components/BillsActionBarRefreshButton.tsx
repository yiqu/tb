'use client';

import { useTransition } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { revalidateBillDue } from '@/server/bills/bills.server';
import { TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

export default function BillsActionBarRefreshButton() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleOnRefreshBills = () => {
    startTransition(async () => {
      await queryClient.invalidateQueries({
        queryKey: [TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS],
      });
      await revalidateBillDue();
    });
  };

  return (
    <Button variant="outline" size="default" className="bg-card" onClick={ handleOnRefreshBills } disabled={ isPending }>
      <RefreshCcw
        className={ cn(`size-4`, {
          'animate-spin': isPending,
        }) }
      />
      Refresh
    </Button>
  );
}
