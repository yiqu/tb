'use client';

import { RotateCcw } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import useSubscriptionDetailsMutationState from '@/hooks/subscriptions/useSubscriptionDetailsMutationState';

export default function EditSubscriptionDialogResetButton() {
  const { isMutationPending } = useSubscriptionDetailsMutationState();

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
      id="edit-subscription-content-reset-button"
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
