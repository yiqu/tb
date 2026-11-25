import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

interface PixelPalsDialogFooterProps {
  /** Disables OK, e.g. when there is nothing to choose. */
  isSubmitDisabled?: boolean;
}

/** Cancel closes the dialog, OK submits its form. */
export default function PixelPalsDialogFooter({ isSubmitDisabled = false }: PixelPalsDialogFooterProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">
          <Typography as="span" variant="span1">
            { PIXEL_PALS_LABELS.cancel }
          </Typography>
        </Button>
      </DialogClose>
      <Button type="submit" disabled={ isSubmitDisabled }>
        <Typography as="span" variant="span1">
          { PIXEL_PALS_LABELS.ok }
        </Typography>
      </Button>
    </DialogFooter>
  );
}
