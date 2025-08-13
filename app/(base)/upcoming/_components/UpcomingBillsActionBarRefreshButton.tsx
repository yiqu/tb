'use client';

import { useTransition } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';
import { revalidateBillDue, revalidateSubscriptions, revalidatePaginationForAllPages } from '@/server/bills/bills.server';

export default function UpcomingBillsActionBarRefreshButton() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleOnRefreshBills = () => {
    startTransition(async () => {
      await queryClient.invalidateQueries({
        queryKey: [TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS],
      });
      await revalidateBillDue();
      await revalidatePaginationForAllPages();
      await revalidateSubscriptions();
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
