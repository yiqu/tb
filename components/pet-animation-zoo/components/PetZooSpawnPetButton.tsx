'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import PetZooDialog from './PetZooDialog';
import PetZooSpawnPetForm from './PetZooSpawnPetForm';
import PetZooToolbarButton from './PetZooToolbarButton';
import { usePetZooPetCount } from '../store/pet-zoo.store';
import { PET_ZOO_MAX_PETS } from '../constants/pet-zoo.constants';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

/** Opens the Spawn pet dialog. Disabled once the zoo holds `PET_ZOO_MAX_PETS` pets. */
export default function PetZooSpawnPetButton() {
  const [open, setOpen] = useState<boolean>(false);
  const petCount: number = usePetZooPetCount();

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    setOpen(true);
  };

  return (
    <>
      <PetZooToolbarButton
        label={ PET_ZOO_LABELS.spawnPet }
        icon={ <Plus /> }
        onClick={ handleOnClick }
        disabled={ petCount >= PET_ZOO_MAX_PETS }
        disabledLabel={ PET_ZOO_LABELS.maxPetsReached }
      />
      <PetZooDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PET_ZOO_LABELS.spawnPetDialogTitle }
        description={ PET_ZOO_LABELS.spawnPetDialogDescription }
      >
        <PetZooSpawnPetForm onDone={ handleOnClose } />
      </PetZooDialog>
    </>
  );
}
