import { Lock } from 'lucide-react';

import Typography from '@/components/typography/Typography';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

/** A lock and "Locked" next to a pet or a theme that cannot be picked. */
export default function PixelPalsLockedLabel() {
  // a span, not RowStack: it sits inside a dropdown option's text, which is a span
  return (
    <span className="flex flex-row items-center gap-1 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      <Typography as="span" variant="caption0">
        { PIXEL_PALS_LABELS.locked }
      </Typography>
    </span>
  );
}
