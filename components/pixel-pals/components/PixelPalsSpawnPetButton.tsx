'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import PixelPalsDialog from './PixelPalsDialog';
import PixelPalsSpawnPetForm from './PixelPalsSpawnPetForm';
import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import { usePixelPalsPetCount } from '../store/pixel-pals.store';
import { PIXEL_PALS_MAX_PETS } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

/** Opens the Spawn pet dialog. Disabled once Pixel Pals holds `PIXEL_PALS_MAX_PETS` pets. */
export default function PixelPalsSpawnPetButton() {
  const [open, setOpen] = useState<boolean>(false);
  const petCount: number = usePixelPalsPetCount();

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
        disabled={ petCount >= PIXEL_PALS_MAX_PETS }
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
