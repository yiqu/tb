'use client';

import { useQueryState } from 'nuqs';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

export default function SubscriptionsTableEditButton({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const [, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    history: 'replace',
    scroll: false,
  });

  const handleOnOpenEditDialog = () => {
    setEditSubscriptionId(subscription.id, {
      history: 'replace',
      scroll: false,
    });
  };

  return (
    <Button variant="ghost" size="icon" className="size-6" type="button" onClick={ handleOnOpenEditDialog }>
      <Pencil />
    </Button>
  );
}
