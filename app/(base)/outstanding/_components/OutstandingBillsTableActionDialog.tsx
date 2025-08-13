'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import EditBillDialogContent from '@/components/bills/EditBillDialogContent';

export default function OutstandingBillsTableActionDialog({ children }: { children: ReactNode }) {
  const [editBillId, setEditBillId] = useQueryState('editBillId', {
    history: 'replace',
    scroll: false,
  });

  const isOpen: boolean = editBillId !== null && editBillId !== undefined && editBillId.trim() !== '';

  const handleOnOpenEditDialog = (open: boolean) => {
    if (!open) {
      setEditBillId(null, {
        scroll: false,
      });
    }
  };

  if (!isOpen || !editBillId) {
    return null;
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <EditBillDialogContent billDueId={ editBillId }>{ children }</EditBillDialogContent>
    </Dialog>
  );
}
