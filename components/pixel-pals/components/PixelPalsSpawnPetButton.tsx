'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import PixelPalsDialog from './PixelPalsDialog';
import PixelPalsSpawnPetForm from './PixelPalsSpawnPetForm';
import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import { useGetUserPixelPetCount, useGetSpawnedPixelPetCount } from '../store/pixel-pets.store';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

/** Opens the Spawn pet dialog. Disabled once `userPixelPetCount` pets are out. */
export default function PixelPalsSpawnPetButton() {
  const [open, setOpen] = useState<boolean>(false);
  const spawnedPetCount: number = useGetSpawnedPixelPetCount();
  const userPixelPetCount: number = useGetUserPixelPetCount();

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    setOpen(true);
  };

  return (
    <>
      <PixelPalsToolbarButton
        label={ PIXEL_PALS_LABELS.spawnPet }
        icon={ <Plus /> }
        onClick={ handleOnClick }
        disabled={ spawnedPetCount >= userPixelPetCount }
        disabledLabel={ PIXEL_PALS_LABELS.maxPetsReached }
      />
      <PixelPalsDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PIXEL_PALS_LABELS.spawnPetDialogTitle }
        description={ PIXEL_PALS_LABELS.spawnPetDialogDescription }
      >
        <PixelPalsSpawnPetForm onDone={ handleOnClose } />
      </PixelPalsDialog>
    </>
  );
}
