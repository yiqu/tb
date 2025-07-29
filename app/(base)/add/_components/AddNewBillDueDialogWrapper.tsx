'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogFooter, DialogContent } from '@/components/ui/dialog';

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
      <DialogContent
        className={ `
          overflow-x-auto px-0 pb-0
          two:w-[800px] two:max-w-[1000px]!
          main:w-[1000px] main:max-w-[1200px]!
          sm:max-w-[600px]
        ` }
      >
        { children }
      </DialogContent>
    </Dialog>
  );
}
