import { X, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import useSubscriptionDetailsMutationState from '@/hooks/subscriptions/useSubscriptionDetailsMutationState';

import EditSubscriptionDialogResetButton from './EditSubscriptionDialogResetButton';

export default function EditSubscriptionDialogContentFooter({ isDataLoading }: { isDataLoading: boolean }) {
  const { isMutationPending } = useSubscriptionDetailsMutationState();

  return (
    <StyledDialogFooter>
      <DialogClose asChild>
        <Button variant="outline" type="button">
          <X />
          Cancel
        </Button>
      </DialogClose>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <EditSubscriptionDialogResetButton />
        <Button
          type="submit"
          className="w-[90px]"
          id="edit-subscription-content-save-button"
          disabled={ isDataLoading || isMutationPending }
          form="edit-subscription-content-form"
        >
          <Save />
          Save
        </Button>
      </div>
    </StyledDialogFooter>
  );
}
