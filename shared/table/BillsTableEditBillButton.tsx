'use client';

import { useQueryState } from 'nuqs';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export default function BillsTableEditBillButton({ billDue }: { billDue: BillDueWithSubscription }) {
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
    <Button variant="ghost" size="icon" className="size-6" type="button" onClick={ handleOnOpenEditDialog }>
      <Pencil />
    </Button>
  );
}
