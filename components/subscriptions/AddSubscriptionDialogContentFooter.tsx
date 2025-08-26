import { X, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';

import AddSubscriptionDialogResetButton from './AddSubscriptionDialogResetButton';

export default function AddSubscriptionDialogContentFooter() {
  return (
    <StyledDialogFooter>
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
    </StyledDialogFooter>
  );
}
