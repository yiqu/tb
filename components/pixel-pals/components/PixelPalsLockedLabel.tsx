import { Lock } from 'lucide-react';

import Typography from '@/components/typography/Typography';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { getPixelPalsUnlockDateLabel } from '../utils/pixel-pals-unlock.utils';

import type { PixelPalsUnlock } from '../models/pixel-pals.models';

interface PixelPalsLockedLabelProps {
  /** The master list's `unlocked`: while it is a date ahead, that day is shown, as the pet or background opens then. */
  unlock: PixelPalsUnlock;
}

/** A lock and "Locked", or the day it unlocks, next to a pet or a theme that cannot be picked yet. */
export default function PixelPalsLockedLabel({ unlock }: PixelPalsLockedLabelProps) {
  const unlockDate: string | null = getPixelPalsUnlockDateLabel(unlock);
  // a span, not RowStack: it sits inside a dropdown option's text, which is a span
  return (
    <span className="flex flex-row items-center gap-1 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      <Typography as="span" variant="caption0">
        { unlockDate ? PIXEL_PALS_LABELS.unlocksOn.replace('{date}', unlockDate) : PIXEL_PALS_LABELS.locked }
      </Typography>
    </span>
  );
}
