'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';
import { useSearchParams } from 'next/navigation';

import { Dialog } from '@/components/ui/dialog';
import EditBillDialogContent from '@/components/bills/EditBillDialogContent';

export default function BillsTableActionDialog({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [, setEditBillId] = useQueryState('editBillId', {
    history: 'push',
    scroll: false,
  });

  const billDueId: string | null = searchParams.get('editBillId');
  const isOpen: boolean = billDueId !== null && billDueId !== undefined && billDueId.trim() !== '';

  const handleOnOpenEditDialog = (open: boolean) => {
    if (!open) {
      setEditBillId(null);
    }
  };

  if (!isOpen || !billDueId) {
    return null;
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <EditBillDialogContent billDueId={ billDueId }>{ children }</EditBillDialogContent>
    </Dialog>
  );
}
