import { X, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

import AddSubscriptionDialogResetButton from './AddSubscriptionDialogResetButton';

export default function AddSubscriptionDialogContentFooter() {
  return (
    <DialogFooter className={ `
      mt-4 flex w-full flex-row bg-sidebar p-4
      sm:items-center sm:justify-between
    ` }>
      <DialogClose asChild>
        <Button variant="outline" type="button">
          <X />
          Cancel
        </Button>
      </DialogClose>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <AddSubscriptionDialogResetButton />
        <Button
          type="submit"
          className="w-[90px]"
          id="add-subscription-content-create-button"
          disabled={ false }
          form="add-subscription-content-form"
        >
          <Save />
          Create
        </Button>
      </div>
    </DialogFooter>
  );
}
