'use client';

import z from 'zod';
import { X, Save } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionDialogFooter() {
  const {
    formState: { isValid },
  } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <StyledDialogFooter>
      <div className="flex w-full flex-row items-center justify-between gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              <X />
              Cancel
            </Button>
          </DialogClose>
          <ResetButton />
        </div>
        <div className="flex flex-row items-center justify-end gap-x-2">
          <Button
            type="submit"
            id="edit-subscription-dialog-save-button"
            disabled={ false }
            form="edit-subscription-dialog-form"
            className={ cn({
              'border-1 border-red-600': !isValid,
            }) }
          >
            <Save />
            Save
          </Button>
        </div>
      </div>
    </StyledDialogFooter>
  );
}

function ResetButton() {
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
      id="edit-subscription-dialog-reset-button"
      onClick={ () => {
        reset();
      } }
    >
      <RotateCcw />
      Reset
    </Button>
  );
}
