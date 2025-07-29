'use client';

import { Plus } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

export default function SubscriptionDetailsHeaderActionButtonAddNewBillDue({
  subscriptionId,
}: {
  subscriptionId: SubscriptionWithBillDues;
}) {
  const [, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    scroll: false,
  });

  const handleOnClick = () => {
    setAddBillDueSubscriptionId(subscriptionId.id);
  };

  return (
    <DropdownMenuItem onClick={ handleOnClick }>
      <Plus className="h-4 w-4" />
      Add new bill due
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
