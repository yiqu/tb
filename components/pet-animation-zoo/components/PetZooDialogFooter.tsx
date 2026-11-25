import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

interface PetZooDialogFooterProps {
  /** Disables OK, e.g. when there is nothing to choose. */
  isSubmitDisabled?: boolean;
}

/** Cancel closes the dialog, OK submits its form. */
export default function PetZooDialogFooter({ isSubmitDisabled = false }: PetZooDialogFooterProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">
          { PET_ZOO_LABELS.cancel }
        </Button>
      </DialogClose>
      <Button type="submit" disabled={ isSubmitDisabled }>
        { PET_ZOO_LABELS.ok }
      </Button>
    </DialogFooter>
  );
}
