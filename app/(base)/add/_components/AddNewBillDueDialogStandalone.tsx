'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

export default function AddNewBillDueDialogStandalone({ children }: { children: ReactNode }) {
  const [addBillDueSubscriptionId, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    history: 'replace',
    scroll: false,
  });

  const isOpen: boolean =
    addBillDueSubscriptionId !== null && addBillDueSubscriptionId !== undefined && addBillDueSubscriptionId.trim() !== '';

  const handleOnOpenEditDialog = (open: boolean) => {
    if (!open) {
      setAddBillDueSubscriptionId(null, {
        history: 'replace',
        scroll: false,
      });
    }
  };

  if (!isOpen || !addBillDueSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <StyledDialogContent
        headerTitle="Add New Bill Due"
        headerDescription={
          <div className="flex w-full flex-row items-center justify-between gap-x-1">
            <div className="flex flex-row items-center justify-start gap-x-1">
              <Typography>Add new bill dues to the subscription.</Typography>
            </div>
            <div className="flex flex-row items-center justify-end gap-x-2"></div>
          </div>
        }
      >
        { children }
      </StyledDialogContent>
    </Dialog>
  );
}
