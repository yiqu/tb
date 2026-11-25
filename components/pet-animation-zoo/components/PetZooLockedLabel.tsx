import { Lock } from 'lucide-react';

import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { getPetZooUnlockDateLabel } from '../utils/pet-zoo-pet.utils';

import type { PetZooPetDefinition } from '../models/pet-zoo.models';

interface PetZooLockedLabelProps {
  definition: PetZooPetDefinition;
}

/** A lock and "Locked", or the day it unlocks, next to a pet that cannot be spawned yet. */
export default function PetZooLockedLabel({ definition }: PetZooLockedLabelProps) {
  const unlockDate: string | null = getPetZooUnlockDateLabel(definition);
  return (
    <RowStack className="items-center gap-1 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      <Typography as="span" variant="caption0">
        { unlockDate ? PET_ZOO_LABELS.petUnlocksOn.replace('{date}', unlockDate) : PET_ZOO_LABELS.petLocked }
      </Typography>
    </RowStack>
  );
}
