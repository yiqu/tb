'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import PetZooDialog from './PetZooDialog';
import PetZooDeletePetForm from './PetZooDeletePetForm';
import PetZooToolbarButton from './PetZooToolbarButton';
import { usePetZooPetCount } from '../store/pet-zoo.store';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

/** Opens the Delete pet dialog. Disabled while the zoo is empty. */
export default function PetZooDeletePetButton() {
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
        label={ PET_ZOO_LABELS.deletePet }
        icon={ <Trash2 /> }
        onClick={ handleOnClick }
        disabled={ petCount === 0 }
        disabledLabel={ PET_ZOO_LABELS.noPetsToDelete }
      />
      <PetZooDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PET_ZOO_LABELS.deletePetDialogTitle }
        description={ PET_ZOO_LABELS.deletePetDialogDescription }
      >
        <PetZooDeletePetForm onDone={ handleOnClose } />
      </PetZooDialog>
    </>
  );
}
