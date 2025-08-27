'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

export default function AddNewBillDueDialogWrapper({ children }: { children: ReactNode }) {
  const [addBillDueSubscriptionId, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    scroll: false,
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setAddBillDueSubscriptionId(null, {
        scroll: false,
      });
    }
  };

  if (!addBillDueSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ !!addBillDueSubscriptionId } onOpenChange={ handleOnOpenChange }>
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
