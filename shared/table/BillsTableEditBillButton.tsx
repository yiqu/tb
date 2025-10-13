'use client';

import { useQueryState } from 'nuqs';
import { Pencil } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';

export default function BillsTableEditBillButton({ billDue }: { billDue: BillDueWithSubscription }) {
  const queryClient = useQueryClient();

  // prefetch bill
  const handleOnPrefetchBill = () => {
    queryClient.prefetchQuery({
      ...getBillDueByIdQueryOptions(billDue.id),
      staleTime: 1000 * 1 * 60 * 5, // 5 minutes
    });
  };

  const [, setEditBillId] = useQueryState('editBillId', {
    history: 'replace',
    scroll: false,
  });

  const handleOnOpenEditDialog = () => {
    setEditBillId(billDue.id, {
      history: 'replace',
      scroll: false,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-6"
      type="button"
      onClick={ handleOnOpenEditDialog }
      onMouseEnter={ handleOnPrefetchBill }
    >
      <Pencil />
    </Button>
  );
}
