'use client';

import { useQueryState } from 'nuqs';
import { X, Plus } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import subscriptionsTableViewStore, { SubscriptionIdBeingEdited } from '@/store/subscriptions/subscriptions.store';

import AddBillConsecutiveAdd from './form-fields/AddBillConsecutiveAdd';

export default function AddNewBillDueDialogFooter() {
  const [addBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {});
  const subscriptionIdBeingEdited: SubscriptionIdBeingEdited = subscriptionsTableViewStore.use.subscriptionIdBeingEdited();

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
          <AddBillConsecutiveAdd />
          <Button
            type="submit"
            id="add-new-bill-due-dialog-save-button"
            disabled={ subscriptionIdBeingEdited[addBillDueSubscriptionId ?? ''] === true }
            form="add-new-bill-due-dialog-form"
          >
            <Plus />
            Add Bill Due
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
      id="edit-bill-dialog-reset-button"
      onClick={ () => {
        reset();
      } }
    >
      <RotateCcw />
      Reset
    </Button>
  );
}
