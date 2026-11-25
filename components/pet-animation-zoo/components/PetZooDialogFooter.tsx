import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
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
          <Typography as="span" variant="span1">
            { PET_ZOO_LABELS.cancel }
          </Typography>
        </Button>
      </DialogClose>
      <Button type="submit" disabled={ isSubmitDisabled }>
        <Typography as="span" variant="span1">
          { PET_ZOO_LABELS.ok }
        </Typography>
      </Button>
    </DialogFooter>
  );
}
