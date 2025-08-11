'use client';

import { RotateCcw } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import useAddNewSubscriptionMutationState from '@/hooks/subscriptions/useAddNewSubscriptionMutationState';

export default function AddSubscriptionDialogResetButton() {
  const { isMutationPending } = useAddNewSubscriptionMutationState();

  const {
    reset,
    formState: { isDirty },
  } = useFormContext();

  if (!isDirty) {
    return null;
  }

  return (
    <Button
      variant="outline"
      type="button"
      id="add-subscription-content-reset-button"
      onClick={ () => {
        reset();
      } }
      disabled={ isMutationPending }
    >
      <RotateCcw />
      Reset
    </Button>
  );
}
