'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditSubscriptionDialogWrapper({ children }: { children: ReactNode }) {
  const [editSubscriptionId, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    scroll: false,
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setEditSubscriptionId(null, {
        scroll: false,
      });
    }
  };

  if (!editSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ !!editSubscriptionId } onOpenChange={ handleOnOpenChange }>
      <DialogContent
        className={ `
          max-h-[90vh] overflow-x-auto overflow-y-auto px-0 pb-0
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
