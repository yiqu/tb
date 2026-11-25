import { Lock } from 'lucide-react';

import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { getPetZooUnlockDateLabel } from '../utils/pet-zoo-unlock.utils';

import type { PetZooUnlock } from '../models/pet-zoo.models';

interface PetZooLockedLabelProps {
  /** The master list's value and the saved one: the earliest date of the two is shown. */
  unlocks: readonly PetZooUnlock[];
}

/** A lock and "Locked", or the day it unlocks, next to a pet or a theme that cannot be picked yet. */
export default function PetZooLockedLabel({ unlocks }: PetZooLockedLabelProps) {
  const unlockDate: string | null = getPetZooUnlockDateLabel(...unlocks);
  return (
    <RowStack className="items-center gap-1 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      <Typography as="span" variant="caption0">
        { unlockDate ? PET_ZOO_LABELS.unlocksOn.replace('{date}', unlockDate) : PET_ZOO_LABELS.locked }
      </Typography>
    </RowStack>
  );
}
