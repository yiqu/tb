'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { SubscriptionIdBeingEdited, useGetSubscriptionBeingEdited } from '@/store/subscriptions/subscriptions.store';

export default function AddNewEntityActionsAddSubButton({ children }: { children: ReactNode }) {
  const subscriptionIdBeingEdited: SubscriptionIdBeingEdited = useGetSubscriptionBeingEdited();
  const isNewSubscription: boolean = subscriptionIdBeingEdited['new-subscription'] === true;

  return (
    <Button variant="default" type="submit" className="w-full" form="add-subscription-content-form" disabled={ isNewSubscription }>
      { children }
    </Button>
  );
}
