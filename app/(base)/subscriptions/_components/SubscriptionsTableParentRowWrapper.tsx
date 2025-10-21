'use client';

import { cn } from '@/lib/utils';
import { TableRow } from '@/components/ui/table';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { SubscriptionIdBeingEdited, useGetSubscriptionBeingEdited } from '@/store/subscriptions/subscriptions.store';

export default function SubscriptionsTableParentRowWrapper({
  subscription,
  children,
}: {
  subscription: SubscriptionWithBillDues;
  children: React.ReactNode;
}) {
  const subscriptionIdBeingEdited: SubscriptionIdBeingEdited = useGetSubscriptionBeingEdited();

  return (
    <TableRow
      className={ cn('hover:bg-muted/20', {
        'bg-yellow-500/20 hover:bg-yellow-500/20': subscriptionIdBeingEdited[subscription.id] === true,
      }) }
    >
      { children }
    </TableRow>
  );
}
