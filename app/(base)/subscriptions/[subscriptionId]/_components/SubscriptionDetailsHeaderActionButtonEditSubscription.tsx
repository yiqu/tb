'use client';

import { useQueryState } from 'nuqs';
import { Pencil } from 'lucide-react';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

export default function SubscriptionDetailsHeaderActionButtonEditSubscription({
  subscriptionId,
}: {
  subscriptionId: SubscriptionWithBillDues;
}) {
  const [, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    scroll: false,
  });

  const handleOnClick = () => {
    setEditSubscriptionId(subscriptionId.id);
  };

  return (
    <DropdownMenuItem onClick={ handleOnClick }>
      <Pencil className="h-4 w-4" />
      Edit subscription
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
