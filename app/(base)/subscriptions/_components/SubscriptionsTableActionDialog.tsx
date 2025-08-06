'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import EditSubscriptionDialogContent from '@/components/subscriptions/EditSubscriptionDialogContent';

export default function SubscriptionsTableActionDialog({ children }: { children: ReactNode }) {
  const [editSubscriptionId, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    history: 'replace',
    scroll: false,
  });

  const isOpen: boolean = editSubscriptionId !== null && editSubscriptionId !== undefined && editSubscriptionId.trim() !== '';

  const handleOnOpenEditDialog = (open: boolean) => {
    if (!open) {
      setEditSubscriptionId(null, {
        history: 'replace',
        scroll: false,
      });
    }
  };

  if (!isOpen || !editSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <EditSubscriptionDialogContent subscriptionId={ editSubscriptionId }>{ children }</EditSubscriptionDialogContent>
    </Dialog>
  );
}
