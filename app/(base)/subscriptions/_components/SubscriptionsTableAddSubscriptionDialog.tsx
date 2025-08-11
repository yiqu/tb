'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import AddSubscriptionDialogContent from '@/components/subscriptions/AddSubscriptionDialogContent';

export default function SubscriptionsTableAddSubscriptionDialog({ children }: { children: ReactNode }) {
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useQueryState('addNewSubscription', {
    scroll: false,
  });

  const isOpen: boolean = deleteSubscriptionId !== null && deleteSubscriptionId !== undefined && deleteSubscriptionId.trim() !== '';

  const handleOnOpenEditDialog = (open: boolean) => {
    if (!open) {
      setDeleteSubscriptionId(null, {
        scroll: false,
      });
    }
  };

  if (!isOpen || !deleteSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <AddSubscriptionDialogContent>{ children }</AddSubscriptionDialogContent>
    </Dialog>
  );
}
