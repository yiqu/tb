'use client';

import { Plus } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

export default function SubscriptionsTableAddDueBillButton({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const [, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    scroll: false,
    shallow: false,
  });

  const handleOnClick = () => {
    setAddBillDueSubscriptionId(subscription.id);
  };

  return (
    <Button variant="ghost" size="icon" className="size-6" type="button" onClick={ handleOnClick }>
      <Plus />
    </Button>
  );
}
